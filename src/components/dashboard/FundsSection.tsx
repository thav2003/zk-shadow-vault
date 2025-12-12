import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Users, 
  Shield, 
  TrendingUp, 
  Eye,
  EyeOff,
  Lock,
  ChevronRight,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore, Fund } from '@/lib/dashboardStore';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

const FundsSection = () => {
  const { funds, setCreateFundModalOpen } = useDashboardStore();
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [showBalances, setShowBalances] = useState(true);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const activeFund = funds.find(f => f.id === selectedFund);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ZK Funds</h2>
          <p className="text-muted-foreground">Manage your private funds and treasuries</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalances(!showBalances)}
          >
            {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button variant="glow" onClick={() => setCreateFundModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Fund
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funds List */}
        <div className="lg:col-span-1 space-y-4">
          {funds.map((fund, i) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedFund(fund.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedFund === fund.id
                  ? 'border-primary bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.2)]'
                  : 'border-border/50 bg-card/50 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Shield className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{fund.name}</h3>
                    <p className="text-xs text-muted-foreground">{fund.type}</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                  selectedFund === fund.id ? 'rotate-90' : ''
                }`} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">TVL</span>
                  <span className="font-mono text-foreground">
                    {showBalances ? `$${(fund.tvl / 1000000).toFixed(2)}M` : '••••••'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">NAV</span>
                  <span className={`font-mono ${fund.navChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {fund.nav}x ({fund.navChange >= 0 ? '+' : ''}{fund.navChange}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Signers</span>
                  <span className="font-mono text-primary">{fund.signers}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fund Details */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {activeFund ? (
              <motion.div
                key={activeFund.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Fund Header */}
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{activeFund.name}</h3>
                      <p className="text-muted-foreground">{activeFund.type} • ID: {activeFund.id}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                      <p className="text-xl font-bold text-foreground">
                        {showBalances ? `$${(activeFund.tvl / 1000000).toFixed(2)}M` : '••••••'}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">NAV</p>
                      <p className="text-xl font-bold text-foreground">{activeFund.nav}x</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Members</p>
                      <p className="text-xl font-bold text-foreground">{activeFund.members}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Multisig</p>
                      <p className="text-xl font-bold text-primary">{activeFund.signers}</p>
                    </div>
                  </div>
                </div>

                {/* Allocation */}
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50">
                  <div className="flex items-center gap-2 mb-6">
                    <PieChart className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-foreground">Asset Allocation</h4>
                    <span className="ml-auto text-xs text-muted-foreground font-mono">
                      ZK-HIDDEN • Proof Only
                    </span>
                  </div>

                  <div className="space-y-4">
                    {activeFund.allocation.length > 0 ? (
                      activeFund.allocation.map((item, i) => (
                        <div key={item.asset}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-foreground">{item.asset}</span>
                            <span className="text-sm font-mono text-muted-foreground">
                              {showBalances ? `${item.percentage}%` : '••%'}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">No allocations yet</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => setIsDepositOpen(true)}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Deposit</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Swap</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => setIsWithdrawOpen(true)}
                  >
                    <Lock className="w-5 h-5" />
                    <span>Withdraw</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Users className="w-5 h-5" />
                    <span>Manage</span>
                  </Button>
                </div>

                {/* Modals */}
                <DepositModal 
                  isOpen={isDepositOpen} 
                  onClose={() => setIsDepositOpen(false)} 
                  fund={activeFund} 
                />
                <WithdrawModal 
                  isOpen={isWithdrawOpen} 
                  onClose={() => setIsWithdrawOpen(false)} 
                  fund={activeFund} 
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center p-12 rounded-2xl border border-dashed border-border/50"
              >
                <div className="text-center">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a fund to view details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FundsSection;
