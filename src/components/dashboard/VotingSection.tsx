import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Vote, 
  Clock, 
  CheckCircle, 
  Shield,
  Lock,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/dashboardStore';

const VotingSection = () => {
  const { votes, castVote } = useDashboardStore();
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [votingChoice, setVotingChoice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProof, setShowProof] = useState(false);

  const handleVote = async () => {
    if (!votingChoice || !selectedVote) return;
    setIsSubmitting(true);
    
    // Simulate ZK proof generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowProof(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    castVote(selectedVote, votingChoice);
    
    setIsSubmitting(false);
    setShowProof(false);
    setSelectedVote(null);
    setVotingChoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Voting Center</h2>
        <p className="text-muted-foreground">Cast anonymous votes with ZK proofs</p>
      </div>

      {/* ZK Voting Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-primary/30 bg-primary/5"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-1">Zero-Knowledge Voting</h3>
            <p className="text-sm text-muted-foreground">
              Your vote is completely private. ZK proofs verify your eligibility and choice 
              without revealing your identity or how you voted.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Votes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {votes.map((vote, i) => (
          <motion.div
            key={vote.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl border transition-all ${
              vote.status === 'ended'
                ? 'border-border/30 bg-card/30'
                : 'border-border/50 bg-card/50 hover:border-primary/50 cursor-pointer'
            }`}
            onClick={() => vote.status === 'active' && !vote.userVoted && setSelectedVote(vote.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">{vote.proposalTitle}</h3>
                <p className="text-sm text-muted-foreground">{vote.fundName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                vote.status === 'active' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {vote.status === 'active' ? 'Active' : 'Ended'}
              </span>
            </div>

            {/* Progress */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-green-500">For: {vote.votesFor}</span>
                <span className="text-muted-foreground">Abstain: {vote.abstain}</span>
                <span className="text-red-500">Against: {vote.votesAgainst}</span>
              </div>
              <div className="h-3 rounded-full bg-muted/50 overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(vote.votesFor / vote.totalVotes) * 100}%` }}
                  transition={{ delay: 0.3 }}
                  className="h-full bg-green-500"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(vote.abstain / vote.totalVotes) * 100}%` }}
                  transition={{ delay: 0.4 }}
                  className="h-full bg-muted-foreground"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(vote.votesAgainst / vote.totalVotes) * 100}%` }}
                  transition={{ delay: 0.5 }}
                  className="h-full bg-red-500"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Quorum: {vote.quorum}/{vote.totalVotes}</span>
                <span className={vote.votesFor + vote.votesAgainst + vote.abstain >= vote.quorum ? 'text-green-500' : ''}>
                  {vote.votesFor + vote.votesAgainst + vote.abstain >= vote.quorum ? '✓ Quorum reached' : 'Quorum not reached'}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  {vote.status === 'active' 
                    ? `Ends: ${new Date(vote.endTime).toLocaleDateString()}`
                    : `Ended: ${new Date(vote.endTime).toLocaleDateString()}`
                  }
                </span>
              </div>
              
              {vote.userVoted ? (
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Voted: {vote.userChoice}</span>
                </div>
              ) : vote.status === 'ended' ? (
                <span className={`text-sm font-medium ${vote.result === 'passed' ? 'text-green-500' : 'text-red-500'}`}>
                  {vote.result === 'passed' ? 'Passed' : 'Rejected'}
                </span>
              ) : (
                <Button size="sm" variant="neon">
                  Cast Vote
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Voting Modal */}
      <AnimatePresence>
        {selectedVote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => !isSubmitting && setSelectedVote(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl border border-border bg-card"
              onClick={e => e.stopPropagation()}
            >
              {showProof ? (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-primary border-t-transparent"
                  />
                  <h3 className="text-lg font-bold text-foreground mb-2">Generating ZK Proof</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    Creating anonymous vote proof...
                  </p>
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 font-mono text-xs text-primary overflow-hidden">
                    <motion.div
                      animate={{ y: [-20, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      proof_hash: 0x8f2e...generating...
                    </motion.div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Vote className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Cast Your Vote</h3>
                      <p className="text-sm text-muted-foreground">Anonymous ZK voting</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {['Approve', 'Reject', 'Abstain'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setVotingChoice(option)}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          votingChoice === option
                            ? 'border-primary bg-primary/10'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{option}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            votingChoice === option ? 'border-primary' : 'border-muted-foreground'
                          }`}>
                            {votingChoice === option && (
                              <div className="w-3 h-3 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 mb-6">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Your identity and choice will be hidden using ZK proofs
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedVote(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="glow" 
                      className="flex-1"
                      onClick={handleVote}
                      disabled={!votingChoice || isSubmitting}
                    >
                      <Zap className="w-4 h-4" />
                      Submit Vote
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VotingSection;
