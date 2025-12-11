import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  Vote, 
  ArrowLeftRight, 
  Settings,
  ChevronLeft,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DashboardTab } from '@/pages/Dashboard';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'funds', label: 'ZK Funds', icon: Wallet },
  { id: 'proposals', label: 'Proposals', icon: FileText },
  { id: 'voting', label: 'Voting', icon: Vote },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

const DashboardSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }: DashboardSidebarProps) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className="fixed left-0 top-0 h-screen bg-card/50 backdrop-blur-xl border-r border-border/50 z-50"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-background" />
            </div>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold text-foreground"
              >
                ZKFund
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Collapse button */}
        <div className="p-4 border-t border-border/50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.div>
            {isOpen && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
