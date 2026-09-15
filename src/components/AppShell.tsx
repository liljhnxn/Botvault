import Navbar from "./Navbar";
export default function AppShell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen"><Navbar />{children}</div>; }
