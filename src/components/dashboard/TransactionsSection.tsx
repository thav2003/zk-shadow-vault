import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft, 
  Layers,
  ExternalLink,
  Copy,
  Check,
  Filter
} from 'lucide-react';
import { useState } from 'react';
import { useDashboardStore } from '@/lib/dashboardStore';

const typeIcons: Record<string, any> = {
  deposit: ArrowDownLeft,
  withdraw: ArrowUpRight,
  swap: ArrowRightLeft,
  allocation: Layers,
};

const typeColors: Record<string, string> = {
  deposit: 'text-green-500 bg-green-500/10',
  withdraw: 'text-orange-500 bg-orange-500/10',
  swap: 'text-blue-500 bg-blue-500/10',
  allocation: 'text-purple-500 bg-purple-500/10',
};

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-500/10 text-green-500',
  pending: 'bg-yellow-500/10 text-yellow-500',
  failed: 'bg-red-500/10 text-red-500',
};

const TransactionsSection = () => {
  const { transactions } = useDashboardStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTx = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
          <p className="text-muted-foreground">All private transactions with ZK proofs ({transactions.length} total)</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {['all', 'deposit', 'withdraw', 'swap', 'allocation'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Fund</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">From → To</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">ZK Proof</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx, i) => {
                  const Icon = typeIcons[tx.type] || Layers;
                  return (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColors[tx.type] || 'text-primary bg-primary/10'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-foreground capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono">
                          <span className="text-foreground">
                            {tx.amount.toLocaleString()} {tx.asset}
                          </span>
                          {tx.toAsset && (
                            <span className="text-muted-foreground">
                              {' → '}{tx.toAmount?.toLocaleString()} {tx.toAsset}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-muted-foreground">{tx.fundName}</span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2 font-mono text-sm">
                          <span className="text-muted-foreground">{tx.from}</span>
                          <span className="text-primary">→</span>
                          <span className="text-muted-foreground">{tx.to}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleCopy(tx.proofHash, tx.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors group"
                        >
                          <span className="font-mono text-xs text-primary">{tx.proofHash}</span>
                          {copiedId === tx.id ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[tx.status] || statusColors.pending}`}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                          {tx.signatures && (
                            <span className="text-xs text-muted-foreground font-mono">
                              ({tx.signatures})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl border border-border/50 bg-card/30"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-1">Private by Design</h3>
            <p className="text-sm text-muted-foreground">
              All transactions are executed through ZK Pool. The "From" and "To" addresses shown are 
              stealth addresses - your actual wallet identity remains completely hidden. Only ZK proofs 
              are recorded on-chain.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionsSection;
