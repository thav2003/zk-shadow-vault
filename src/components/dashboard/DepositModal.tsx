import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Check, Loader2, Plus, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore, Fund } from '@/lib/dashboardStore';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: Fund;
}

const DepositModal = ({ isOpen, onClose, fund }: DepositModalProps) => {
  const { addTransaction, funds } = useDashboardStore();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('USDC');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setStep(2);
    setIsGeneratingProof(true);
    
    // Simulate ZK proof generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGeneratingProof(false);
    setStep(3);
    
    // Add transaction
    addTransaction({
      type: 'Deposit',
      amount: parseFloat(amount),
      asset,
      fundName: fund.name,
      from: 'wallet_0x7a...3f2d',
      to: `zk_pool_${fund.id.split('_')[1] || 'main'}`,
    });
    
    // Update fund TVL
    useDashboardStore.setState((state) => ({
      funds: state.funds.map(f => 
        f.id === fund.id 
          ? { ...f, tvl: f.tvl + parseFloat(amount) * 1000 } 
          : f
      ),
    }));
  };

  const handleClose = () => {
    setStep(1);
    setAmount('');
    setAsset('USDC');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Step 1: Input */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Deposit to Fund</h3>
                    <p className="text-sm text-muted-foreground">{fund.name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="asset">Asset</Label>
                    <Select value={asset} onValueChange={setAsset}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value="WBTC">WBTC</SelectItem>
                        <SelectItem value="DAI">DAI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pr-16 font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {asset}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Available: 50,000 {asset}</span>
                      <button 
                        onClick={() => setAmount('50000')} 
                        className="text-primary hover:underline"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>ZK Privacy Protection</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your deposit will be shielded using zero-knowledge proofs. 
                      The amount and source will be hidden on-chain.
                    </p>
                  </div>

                  <Button 
                    variant="glow" 
                    className="w-full"
                    onClick={handleDeposit}
                    disabled={!amount || parseFloat(amount) <= 0}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Deposit with ZK Proof
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: ZK Proof Generation */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  {/* Animated rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-secondary/30"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Shield className="w-12 h-12 text-primary" />
                    </motion.div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                  Generating ZK Proof
                </h3>
                <p className="text-muted-foreground mb-4">
                  Creating privacy shield for your deposit...
                </p>

                <div className="space-y-2 text-left max-w-xs mx-auto">
                  {[
                    'Verifying wallet balance',
                    'Computing commitment hash',
                    'Generating SNARK proof',
                    'Preparing stealth deposit'
                  ].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.5 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      {i < Math.floor((Date.now() / 500) % 4) ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      )}
                      <span className="text-muted-foreground">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                  Deposit Complete!
                </h3>
                <p className="text-muted-foreground mb-6">
                  {amount} {asset} deposited privately to {fund.name}
                </p>

                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-left mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-mono text-foreground">{amount} {asset}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Privacy</span>
                    <span className="text-green-500">Shielded</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-primary">Confirmed</span>
                  </div>
                </div>

                <Button variant="glow" className="w-full" onClick={handleClose}>
                  Done
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DepositModal;
