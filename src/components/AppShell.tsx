import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        {children}
      </div>
      <Footer />
    </div>
  );
}

