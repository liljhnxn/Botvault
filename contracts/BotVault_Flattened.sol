// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// OpenZeppelin Contracts (last updated v5.1.0) (utils/StorageSlot.sol)
library StorageSlot {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    struct Int256Slot {
        int256 value;
    }

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
    }

    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    function getInt256Slot(bytes32 slot) internal pure returns (Int256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }

    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }
}

// OpenZeppelin Contracts (last updated v5.5.0) (utils/ReentrancyGuard.sol)
abstract contract ReentrancyGuard {
    using StorageSlot for bytes32;

    bytes32 private constant REENTRANCY_GUARD_STORAGE =
        0x9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00;

    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    error ReentrancyGuardReentrantCall();

    constructor() {
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    modifier nonReentrantView() {
        _nonReentrantBeforeView();
        _;
    }

    function _nonReentrantBeforeView() private view {
        if (_reentrancyGuardEntered()) {
            revert ReentrancyGuardReentrantCall();
        }
    }

    function _nonReentrantBefore() private {
        _nonReentrantBeforeView();
        _reentrancyGuardStorageSlot().getUint256Slot().value = ENTERED;
    }

    function _nonReentrantAfter() private {
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    function _reentrancyGuardEntered() internal view returns (bool) {
        return _reentrancyGuardStorageSlot().getUint256Slot().value == ENTERED;
    }

    function _reentrancyGuardStorageSlot() internal pure virtual returns (bytes32) {
        return REENTRANCY_GUARD_STORAGE;
    }
}

contract BotVault is ReentrancyGuard {
    enum Status { Locked, Unlocked, Withdrawn }
    struct Vault { uint256 vaultId; address owner; uint256 amount; uint256 unlockTime; uint256 createdAt; bool withdrawn; }

    uint256 private _vaultCount;
    mapping(uint256 => Vault) private _vaults;
    mapping(address => uint256[]) private _userVaults;

    event VaultCreated(uint256 indexed vaultId, address indexed owner, uint256 amount, uint256 unlockTime);
    event VaultDeposit(uint256 indexed vaultId, uint256 amount);
    event VaultWithdrawn(uint256 indexed vaultId, address indexed owner, uint256 amount);

    error InvalidVault(); error NotOwner(); error ZeroAmount(); error UnlockTimeNotFuture(); error StillLocked(); error AlreadyWithdrawn();

    function createVault(uint256 unlockTime) external payable returns (uint256 vaultId) {
        if (msg.value == 0) revert ZeroAmount();
        if (unlockTime <= block.timestamp) revert UnlockTimeNotFuture();
        vaultId = ++_vaultCount;
        _vaults[vaultId] = Vault(vaultId, msg.sender, msg.value, unlockTime, block.timestamp, false);
        _userVaults[msg.sender].push(vaultId);
        emit VaultCreated(vaultId, msg.sender, msg.value, unlockTime);
    }

    function deposit(uint256 vaultId) external payable {
        Vault storage vault = _getVault(vaultId);
        if (vault.owner != msg.sender) revert NotOwner();
        if (vault.withdrawn) revert AlreadyWithdrawn();
        if (msg.value == 0) revert ZeroAmount();
        vault.amount += msg.value;
        emit VaultDeposit(vaultId, msg.value);
    }

    function withdraw(uint256 vaultId) external nonReentrant {
        Vault storage vault = _getVault(vaultId);
        if (vault.owner != msg.sender) revert NotOwner();
        if (vault.withdrawn) revert AlreadyWithdrawn();
        if (block.timestamp < vault.unlockTime) revert StillLocked();
        uint256 amount = vault.amount;
        vault.amount = 0;
        vault.withdrawn = true;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit VaultWithdrawn(vaultId, msg.sender, amount);
    }

    function getVault(uint256 vaultId) external view returns (Vault memory) { return _getVault(vaultId); }
    function getUserVaults(address user) external view returns (uint256[] memory) { return _userVaults[user]; }
    function getVaultCount() external view returns (uint256) { return _vaultCount; }
    function isUnlocked(uint256 vaultId) external view returns (bool) { Vault memory vault = _getVault(vaultId); return !vault.withdrawn && block.timestamp >= vault.unlockTime; }
    function status(uint256 vaultId) external view returns (Status) { Vault memory vault = _getVault(vaultId); return vault.withdrawn ? Status.Withdrawn : (block.timestamp >= vault.unlockTime ? Status.Unlocked : Status.Locked); }

    function _getVault(uint256 vaultId) internal view returns (Vault storage) {
        if (vaultId == 0 || vaultId > _vaultCount) revert InvalidVault();
        return _vaults[vaultId];
    }
}
