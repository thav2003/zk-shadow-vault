import { Bell, Search, Menu, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { DashboardTab } from '@/pages/Dashboard';

interface DashboardHeaderProps {
  activeTab: DashboardTab;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const tabTitles: Record<DashboardTab, string> = {
  overview: 'Dashboard Overview',
  funds: 'ZK Funds Management',
  proposals: 'Proposals',
  voting: 'Voting Center',
  transactions: 'Transaction History',
  settings: 'Settings',
};

const DashboardHeader = ({ activeTab, isSidebarOpen, setIsSidebarOpen }: DashboardHeaderProps) => {
  const [copied, setCopied] = useState(false);
  const walletAddress = '0x7a3d...8f2e';

  const handleCopy = () => {
    navigator.clipboard.writeText('0x7a3d4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">{tabTitles[activeTab]}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border/50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-muted-foreground"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
          </button>

          {/* Wallet */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-mono">{walletAddress}</span>
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
