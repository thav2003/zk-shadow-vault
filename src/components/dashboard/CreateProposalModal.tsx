import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Wallet, ArrowRightLeft, Settings, Lock, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/dashboardStore';

const proposalTypes = [
  { value: 'allocation', label: 'Allocation', icon: Wallet, description: 'Allocate funds to strategy' },
  { value: 'swap', label: 'Swap', icon: ArrowRightLeft, description: 'Execute private swap' },
  { value: 'withdraw', label: 'Withdraw', icon: Wallet, description: 'Withdraw to address' },
  { value: 'governance', label: 'Governance', icon: Settings, description: 'Change fund settings' },
];

const CreateProposalModal = () => {
  const { isCreateProposalModalOpen, setCreateProposalModalOpen, createProposal, funds } = useDashboardStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'allocation',
    fundId: '',
    amount: 0,
  });

  const handleClose = () => {
    if (isCreating) return;
    setCreateProposalModalOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ title: '', description: '', type: 'allocation', fundId: '', amount: 0 });
    }, 300);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    createProposal(formData);
    
    setIsCreating(false);
    setIsSuccess(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    handleClose();
  };

  const isValid = formData.title.trim() && formData.fundId;

  return (
    <AnimatePresence>
      {isCreateProposalModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-2">Proposal Created!</h3>
                <p className="text-muted-foreground">Waiting for signatures</p>
              </motion.div>
            ) : isCreating ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-primary border-t-transparent"
                />
                <h3 className="text-lg font-bold text-foreground mb-2">Creating Proposal</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Submitting to ZK network...
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">New Proposal</h3>
                      <p className="text-sm text-muted-foreground">Create a fund proposal</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="p-2 rounded-lg hover:bg-muted/50">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Select Fund */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Fund *
                    </label>
                    <select
                      value={formData.fundId}
                      onChange={(e) => setFormData({ ...formData, fundId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">Choose a fund...</option>
                      {funds.map((fund) => (
                        <option key={fund.id} value={fund.id}>{fund.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Proposal Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Proposal Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {proposalTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setFormData({ ...formData, type: type.value })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            formData.type === type.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border/50 hover:border-primary/50'
                          }`}
                        >
                          <type.icon className="w-4 h-4 text-primary mb-1" />
                          <div className="text-sm font-medium text-foreground">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter proposal title..."
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the proposal..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  {/* Amount (conditional) */}
                  {(formData.type === 'allocation' || formData.type === 'swap' || formData.type === 'withdraw') && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Amount (USDC)
                      </label>
                      <input
                        type="number"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                        placeholder="Enter amount..."
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      Proposal details are encrypted. Only ZK proofs are public.
                    </span>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="flex-1" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button variant="glow" className="flex-1" onClick={handleCreate} disabled={!isValid}>
                      <Zap className="w-4 h-4" />
                      Create Proposal
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateProposalModal;
