import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("BotVault", function () {
  // Hardhat's dynamic contract proxy is only used inside tests.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function setup() { const [owner, other] = await ethers.getSigners(); const factory = await ethers.getContractFactory("BotVault"); const vault = await factory.deploy() as any; return { vault, owner, other }; }
  it("creates a vault and stores its data", async function () { const { vault, owner } = await setup(); const unlock = (await ethers.provider.getBlock("latest"))!.timestamp + 3600; await expect(vault.createVault(unlock, { value: ethers.parseEther("1") })).to.emit(vault, "VaultCreated").withArgs(1, owner.address, ethers.parseEther("1"), unlock); const stored = await vault.getVault(1); expect(stored.owner).to.equal(owner.address); expect(stored.amount).to.equal(ethers.parseEther("1")); });
  it("rejects zero deposits and past dates", async function () { const { vault } = await setup(); const now = (await ethers.provider.getBlock("latest"))!.timestamp; await expect(vault.createVault(now + 100, { value: 0 })).to.be.revertedWithCustomError(vault, "ZeroAmount"); await expect(vault.createVault(now - 1, { value: 1 })).to.be.revertedWithCustomError(vault, "UnlockTimeNotFuture"); });
  it("allows the owner to add funds and blocks non-owners", async function () { const { vault, other } = await setup(); const unlock = (await ethers.provider.getBlock("latest"))!.timestamp + 3600; await vault.createVault(unlock, { value: ethers.parseEther("1") }); await expect(vault.deposit(1, { value: ethers.parseEther(".5") })).to.emit(vault, "VaultDeposit"); await expect(vault.connect(other).deposit(1, { value: 1 })).to.be.revertedWithCustomError(vault, "NotOwner"); });
  it("only withdraws after unlock and prevents double withdrawal", async function () { const { vault, owner, other } = await setup(); const unlock = (await ethers.provider.getBlock("latest"))!.timestamp + 100; await vault.createVault(unlock, { value: ethers.parseEther("1") }); await expect(vault.withdraw(1)).to.be.revertedWithCustomError(vault, "StillLocked"); await ethers.provider.send("evm_increaseTime", [101]); await ethers.provider.send("evm_mine"); await expect(vault.connect(other).withdraw(1)).to.be.revertedWithCustomError(vault, "NotOwner"); await expect(vault.withdraw(1)).to.emit(vault, "VaultWithdrawn").withArgs(1, owner.address, ethers.parseEther("1")); await expect(vault.withdraw(1)).to.be.revertedWithCustomError(vault, "AlreadyWithdrawn"); });
  it("rejects invalid vault ids", async function () { const { vault } = await setup(); await expect(vault.getVault(99)).to.be.revertedWithCustomError(vault, "InvalidVault"); });
  it("tracks user vaults and vault count accurately", async function () {
    const { vault, owner } = await setup();
    expect(await vault.getVaultCount()).to.equal(0);
    const unlock = (await ethers.provider.getBlock("latest"))!.timestamp + 3600;
    await vault.createVault(unlock, { value: ethers.parseEther("1") });
    await vault.createVault(unlock + 100, { value: ethers.parseEther("2") });
    expect(await vault.getVaultCount()).to.equal(2);
    const userVaults = await vault.getUserVaults(owner.address);
    expect(userVaults.length).to.equal(2);
    expect(userVaults[0]).to.equal(1);
    expect(userVaults[1]).to.equal(2);
  });
  it("correctly evaluates isUnlocked and status enums", async function () {
    const { vault } = await setup();
    const unlock = (await ethers.provider.getBlock("latest"))!.timestamp + 200;
    await vault.createVault(unlock, { value: ethers.parseEther("1") });
    expect(await vault.isUnlocked(1)).to.equal(false);
    expect(await vault.status(1)).to.equal(0); // Status.Locked
    await ethers.provider.send("evm_increaseTime", [205]);
    await ethers.provider.send("evm_mine");
    expect(await vault.isUnlocked(1)).to.equal(true);
    expect(await vault.status(1)).to.equal(1); // Status.Unlocked
    await vault.withdraw(1);
    expect(await vault.isUnlocked(1)).to.equal(false);
    expect(await vault.status(1)).to.equal(2); // Status.Withdrawn
  });
  it("prevents depositing into already withdrawn vaults", async function () {
    const { vault } = await setup();
    const unlock = (await ethers.provider.getBlock("latest"))!.timestamp + 100;
    await vault.createVault(unlock, { value: ethers.parseEther("1") });
    await ethers.provider.send("evm_increaseTime", [105]);
    await ethers.provider.send("evm_mine");
    await vault.withdraw(1);
    await expect(vault.deposit(1, { value: ethers.parseEther("1") })).to.be.revertedWithCustomError(vault, "AlreadyWithdrawn");
  });
});
