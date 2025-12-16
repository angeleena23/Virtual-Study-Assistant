import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
