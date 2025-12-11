import { create } from 'zustand';
import { mockFunds, mockProposals, mockVotes, mockTransactions, mockStats, mockActivity } from './mockData';

export interface Fund {
  id: string;
  name: string;
  type: string;
  tvl: number;
  nav: number;
  navChange: number;
  members: number;
  signers: string;
  status: string;
  allocation: { asset: string; percentage: number }[];
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  fundId: string;
  fundName: string;
  requiredSignatures: string;
  currentSignatures: number;
  deadline: string;
  createdAt: string;
  createdBy: string;
  amount?: number;
  votesFor?: number;
  votesAgainst?: number;
  totalVotes?: number;
}

export interface Vote {
  id: string;
  proposalId: string;
  proposalTitle: string;
  fundName: string;
  status: string;
  endTime: string;
  votesFor: number;
  votesAgainst: number;
  abstain: number;
  totalVotes: number;
  quorum: number;
  userVoted: boolean;
  userChoice?: string;
  result?: string;
  options: string[];
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  asset: string;
  toAsset?: string;
  toAmount?: number;
  fundName: string;
  status: string;
  timestamp: string;
  proofHash: string;
  from: string;
  to: string;
  signatures?: string;
}

interface DashboardState {
  funds: Fund[];
  proposals: Proposal[];
  votes: Vote[];
  transactions: Transaction[];
  stats: typeof mockStats;
  activity: typeof mockActivity;
  
  // Modal states
  isCreateFundModalOpen: boolean;
  isCreateProposalModalOpen: boolean;
  
  // Actions
  setCreateFundModalOpen: (open: boolean) => void;
  setCreateProposalModalOpen: (open: boolean) => void;
  
  // Fund actions
  createFund: (fund: Omit<Fund, 'id' | 'tvl' | 'nav' | 'navChange' | 'status' | 'allocation'>) => void;
  
  // Proposal actions
  createProposal: (proposal: {
    title: string;
    description: string;
    type: string;
    fundId: string;
    amount?: number;
  }) => void;
  signProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string) => void;
  
  // Vote actions
  castVote: (voteId: string, choice: string) => void;
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'proofHash' | 'status'>) => void;
}

const generateId = (prefix: string) => `${prefix}_${Date.now().toString(36)}`;
const generateProofHash = () => `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`;

export const useDashboardStore = create<DashboardState>((set, get) => ({
  funds: [...mockFunds] as Fund[],
  proposals: [...mockProposals] as Proposal[],
  votes: [...mockVotes] as Vote[],
  transactions: [...mockTransactions] as Transaction[],
  stats: { ...mockStats },
  activity: [...mockActivity],
  
  isCreateFundModalOpen: false,
  isCreateProposalModalOpen: false,
  
  setCreateFundModalOpen: (open) => set({ isCreateFundModalOpen: open }),
  setCreateProposalModalOpen: (open) => set({ isCreateProposalModalOpen: open }),
  
  createFund: (fundData) => {
    const newFund: Fund = {
      id: generateId('zkfund'),
      tvl: 0,
      nav: 1.0,
      navChange: 0,
      status: 'active',
      allocation: [],
      ...fundData,
    };
    
    set((state) => ({
      funds: [...state.funds, newFund],
      stats: { ...state.stats, totalFunds: state.stats.totalFunds + 1 },
      activity: [
        { time: 'Just now', action: `New fund created: ${newFund.name}`, fund: newFund.name },
        ...state.activity.slice(0, 4),
      ],
    }));
  },
  
  createProposal: (proposalData) => {
    const fund = get().funds.find(f => f.id === proposalData.fundId);
    if (!fund) return;
    
    const newProposal: Proposal = {
      id: generateId('prop'),
      title: proposalData.title,
      description: proposalData.description,
      type: proposalData.type,
      status: 'active',
      fundId: proposalData.fundId,
      fundName: fund.name,
      requiredSignatures: fund.signers,
      currentSignatures: 0,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      amount: proposalData.amount,
    };
    
    set((state) => ({
      proposals: [newProposal, ...state.proposals],
      stats: { ...state.stats, activeProposals: state.stats.activeProposals + 1 },
      activity: [
        { time: 'Just now', action: `New proposal: ${newProposal.title}`, fund: fund.name },
        ...state.activity.slice(0, 4),
      ],
    }));
  },
  
  signProposal: (proposalId) => {
    set((state) => {
      const proposals = state.proposals.map(p => {
        if (p.id !== proposalId) return p;
        
        const newSignatures = p.currentSignatures + 1;
        const requiredSigs = parseInt(p.requiredSignatures.split('/')[0]);
        const newStatus = newSignatures >= requiredSigs ? 'executed' : p.status;
        
        return { ...p, currentSignatures: newSignatures, status: newStatus };
      });
      
      const proposal = proposals.find(p => p.id === proposalId);
      
      // Create transaction if executed
      let transactions = state.transactions;
      if (proposal?.status === 'executed') {
        const newTx: Transaction = {
          id: generateId('tx'),
          type: proposal.type,
          amount: proposal.amount || 0,
          asset: 'USDC',
          fundName: proposal.fundName,
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          proofHash: generateProofHash(),
          from: `zk_pool_${proposal.fundId.split('_')[1]}`,
          to: proposal.type === 'withdraw' ? `stealth_${generateId('')}` : `strategy_${generateId('')}`,
        };
        transactions = [newTx, ...transactions];
      }
      
      return {
        proposals,
        transactions,
        stats: {
          ...state.stats,
          zkProofsGenerated: state.stats.zkProofsGenerated + 1,
          privateTransactions: proposal?.status === 'executed' 
            ? state.stats.privateTransactions + 1 
            : state.stats.privateTransactions,
        },
        activity: [
          { 
            time: 'Just now', 
            action: proposal?.status === 'executed' ? 'Proposal executed' : 'Signature added (ZK Proof)', 
            fund: proposal?.fundName || '' 
          },
          ...state.activity.slice(0, 4),
        ],
      };
    });
  },
  
  rejectProposal: (proposalId) => {
    set((state) => ({
      proposals: state.proposals.map(p => 
        p.id === proposalId ? { ...p, status: 'rejected' } : p
      ),
      stats: { ...state.stats, activeProposals: Math.max(0, state.stats.activeProposals - 1) },
      activity: [
        { 
          time: 'Just now', 
          action: 'Proposal rejected', 
          fund: state.proposals.find(p => p.id === proposalId)?.fundName || '' 
        },
        ...state.activity.slice(0, 4),
      ],
    }));
  },
  
  castVote: (voteId, choice) => {
    set((state) => {
      const votes = state.votes.map(v => {
        if (v.id !== voteId) return v;
        
        let newVotesFor = v.votesFor;
        let newVotesAgainst = v.votesAgainst;
        let newAbstain = v.abstain;
        
        if (choice === 'Approve') newVotesFor += 1;
        else if (choice === 'Reject') newVotesAgainst += 1;
        else newAbstain += 1;
        
        return {
          ...v,
          votesFor: newVotesFor,
          votesAgainst: newVotesAgainst,
          abstain: newAbstain,
          userVoted: true,
          userChoice: choice,
        };
      });
      
      const vote = votes.find(v => v.id === voteId);
      
      return {
        votes,
        stats: {
          ...state.stats,
          zkProofsGenerated: state.stats.zkProofsGenerated + 1,
          pendingVotes: Math.max(0, state.stats.pendingVotes - 1),
        },
        activity: [
          { time: 'Just now', action: 'Vote submitted (ZK Proof)', fund: vote?.fundName || '' },
          ...state.activity.slice(0, 4),
        ],
      };
    });
  },
  
  addTransaction: (txData) => {
    const newTx: Transaction = {
      id: generateId('tx'),
      timestamp: new Date().toISOString(),
      proofHash: generateProofHash(),
      status: 'pending',
      ...txData,
    };
    
    set((state) => ({
      transactions: [newTx, ...state.transactions],
      stats: {
        ...state.stats,
        privateTransactions: state.stats.privateTransactions + 1,
        zkProofsGenerated: state.stats.zkProofsGenerated + 1,
      },
      activity: [
        { time: 'Just now', action: `${txData.type} initiated`, fund: txData.fundName },
        ...state.activity.slice(0, 4),
      ],
    }));
  },
}));
