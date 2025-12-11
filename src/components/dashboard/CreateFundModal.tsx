import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Users, Lock, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/dashboardStore';

const fundTypes = [
  { value: 'Private Equity', label: 'Private Equity', icon: Shield },
  { value: 'OTC Trading', label: 'OTC Trading', icon: Lock },
  { value: 'DAO Treasury', label: 'DAO Treasury', icon: Users },
];

const CreateFundModal = () => {
  const { isCreateFundModalOpen, setCreateFundModalOpen, createFund } = useDashboardStore();
  
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Private Equity',
    members: 5,
    signers: '3/5',
  });

  const handleClose = () => {
    if (isCreating) return;
    setCreateFundModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
      setFormData({ name: '', type: 'Private Equity', members: 5, signers: '3/5' });
    }, 300);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    
    // Simulate ZK proof generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    createFund(formData);
    
    setIsCreating(false);
    setIsSuccess(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    handleClose();
  };

  const signerOptions = ['2/3', '3/5', '4/6', '5/7', '5/9'];

  return (
    <AnimatePresence>
      {isCreateFundModalOpen && (
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
            className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card"
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
                <h3 className="text-xl font-bold text-foreground mb-2">Fund Created!</h3>
                <p className="text-muted-foreground">Your ZK Fund is now active</p>
              </motion.div>
            ) : isCreating ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-primary border-t-transparent"
                />
                <h3 className="text-lg font-bold text-foreground mb-2">Creating ZK Fund</h3>
                <p className="text-sm text-muted-foreground font-mono mb-4">
                  Generating ZK proofs and initializing treasury...
                </p>
                <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs text-primary">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    proof_generation: in_progress...
                  </motion.div>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Shield className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Create ZK Fund</h3>
                      <p className="text-sm text-muted-foreground">Step {step} of 2</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="p-2 rounded-lg hover:bg-muted/50">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Progress */}
                <div className="flex gap-2 mb-6">
                  <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted/50'}`} />
                  <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted/50'}`} />
                </div>

                {step === 1 ? (
                  <div className="space-y-4">
                    {/* Fund Name */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Fund Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter fund name..."
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Fund Type */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Fund Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {fundTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => setFormData({ ...formData, type: type.value })}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              formData.type === type.value
                                ? 'border-primary bg-primary/10'
                                : 'border-border/50 hover:border-primary/50'
                            }`}
                          >
                            <type.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                            <span className="text-xs text-foreground">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="glow"
                      className="w-full mt-4"
                      onClick={() => setStep(2)}
                      disabled={!formData.name.trim()}
                    >
                      Continue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Members */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Initial Members
                      </label>
                      <input
                        type="number"
                        min={2}
                        max={100}
                        value={formData.members}
                        onChange={(e) => setFormData({ ...formData, members: parseInt(e.target.value) || 2 })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Multisig Threshold */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Multisig Threshold
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {signerOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => setFormData({ ...formData, signers: option })}
                            className={`px-4 py-2 rounded-lg border font-mono text-sm transition-all ${
                              formData.signers === option
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border/50 text-muted-foreground hover:border-primary/50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        Fund will be protected with ZK proofs. All operations are private.
                      </span>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button variant="glow" className="flex-1" onClick={handleCreate}>
                        <Zap className="w-4 h-4" />
                        Create Fund
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateFundModal;
