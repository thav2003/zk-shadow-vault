import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRightLeft,
  Wallet,
  Settings,
  Filter,
  Search,
  Zap,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/dashboardStore';

const typeIcons: Record<string, any> = {
  allocation: Wallet,
  swap: ArrowRightLeft,
  withdraw: Wallet,
  governance: Settings,
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/30',
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  executed: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  voting: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/30',
};

const ProposalsSection = () => {
  const { proposals, setCreateProposalModalOpen, signProposal, rejectProposal } = useDashboardStore();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [signingId, setSigningId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const filteredProposals = proposals.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleSign = async (proposalId: string) => {
    setSigningId(proposalId);
    // Simulate ZK proof generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    signProposal(proposalId);
    setSigningId(null);
  };

  const handleReject = async (proposalId: string) => {
    setRejectingId(proposalId);
    await new Promise(resolve => setTimeout(resolve, 500));
    rejectProposal(proposalId);
    setRejectingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Proposals</h2>
          <p className="text-muted-foreground">Create and manage fund proposals</p>
        </div>
        <Button variant="glow" onClick={() => setCreateProposalModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Proposal
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border/50 flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground text-foreground"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {['all', 'active', 'pending', 'voting', 'executed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredProposals.map((proposal, i) => {
            const Icon = typeIcons[proposal.type] || Settings;
            const isVoting = proposal.status === 'voting';
            const isSigning = signingId === proposal.id;
            const isRejecting = rejectingId === proposal.id;
            const canAct = proposal.status === 'active' || proposal.status === 'pending';
            
            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground">{proposal.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${statusColors[proposal.status]}`}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                      <span className="text-muted-foreground">
                        Fund: <span className="text-foreground">{proposal.fundName}</span>
                      </span>
                      {proposal.amount && (
                        <span className="text-muted-foreground">
                          Amount: <span className="text-foreground font-mono">${proposal.amount.toLocaleString()}</span>
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        Signatures: <span className="text-primary font-mono">{proposal.currentSignatures}/{proposal.requiredSignatures.split('/')[0]}</span>
                      </span>
                    </div>

                    {/* Voting Progress */}
                    {isVoting && proposal.votesFor !== undefined && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-green-500">For: {proposal.votesFor}</span>
                          <span className="text-red-500">Against: {proposal.votesAgainst}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/50 overflow-hidden flex">
                          <div 
                            className="h-full bg-green-500"
                            style={{ width: `${(proposal.votesFor! / proposal.totalVotes!) * 100}%` }}
                          />
                          <div 
                            className="h-full bg-red-500"
                            style={{ width: `${(proposal.votesAgainst! / proposal.totalVotes!) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Signature Progress */}
                    {!isVoting && proposal.status !== 'rejected' && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2">
                          {Array.from({ length: parseInt(proposal.requiredSignatures.split('/')[1]) }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-8 h-2 rounded-full ${
                                idx < proposal.currentSignatures
                                  ? 'bg-primary'
                                  : 'bg-muted/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Deadline: {new Date(proposal.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canAct ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReject(proposal.id)}
                              disabled={isSigning || isRejecting}
                              className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                            >
                              {isRejecting ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                                  className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"
                                />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              variant="neon"
                              onClick={() => handleSign(proposal.id)}
                              disabled={isSigning || isRejecting}
                            >
                              {isSigning ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                                  />
                                  Signing...
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4" />
                                  Sign Proposal
                                </>
                              )}
                            </Button>
                          </>
                        ) : proposal.status === 'voting' ? (
                          <Button size="sm" variant="neon">
                            Cast Vote
                          </Button>
                        ) : proposal.status === 'executed' ? (
                          <div className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Executed</span>
                          </div>
                        ) : proposal.status === 'rejected' ? (
                          <div className="flex items-center gap-1 text-red-500">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm">Rejected</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredProposals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No proposals found
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalsSection;
