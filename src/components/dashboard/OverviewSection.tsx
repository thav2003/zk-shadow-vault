import { motion } from 'framer-motion';
import { 
  Wallet, 
  Vote, 
  ArrowUpRight, 
  ArrowDownRight,
  Shield,
  Users,
  Activity,
  Lock
} from 'lucide-react';
import { useDashboardStore } from '@/lib/dashboardStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { mockChartData } from '@/lib/mockData';

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  prefix = '',
  suffix = '' 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  change?: number;
  prefix?: string;
  suffix?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <p className="text-2xl font-bold text-foreground mb-1">
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
    </p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </motion.div>
);

const OverviewSection = () => {
  const { stats, activity, funds } = useDashboardStore();

  // Calculate dynamic TVL from funds
  const totalTVL = funds.reduce((sum, fund) => sum + fund.tvl, 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Wallet} 
          label="Total Value Locked" 
          value={`$${(totalTVL / 1000000).toFixed(1)}M`}
          change={8.5}
        />
        <StatCard 
          icon={Vote} 
          label="Active Proposals" 
          value={stats.activeProposals}
        />
        <StatCard 
          icon={Shield} 
          label="ZK Proofs Generated" 
          value={stats.zkProofsGenerated}
          change={12.3}
        />
        <StatCard 
          icon={Lock} 
          label="Private Transactions" 
          value={stats.privateTransactions}
          change={5.7}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TVL Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Total Value Locked</h3>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">TVL ($M)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-sm text-muted-foreground">Volume ($M)</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="tvl" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#tvlGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="volume" 
                stroke="hsl(var(--secondary))" 
                fillOpacity={1} 
                fill="url(#volumeGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {activity.slice(0, 5).map((item, i) => (
              <motion.div
                key={`${item.action}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3 pb-4 border-b border-border/30 last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.fund}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Funds Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Your Funds</h3>
          </div>
          <span className="text-sm text-muted-foreground">{funds.length} active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {funds.slice(0, 3).map((fund, i) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {fund.name}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  fund.status === 'active' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {fund.status === 'active' ? 'Active' : fund.status}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">
                ${(fund.tvl / 1000000).toFixed(2)}M
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">NAV: {fund.nav}x</span>
                <span className={fund.navChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {fund.navChange >= 0 ? '+' : ''}{fund.navChange}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewSection;
