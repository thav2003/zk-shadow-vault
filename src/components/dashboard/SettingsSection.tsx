import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Key,
  Wallet,
  Globe,
  Moon,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SettingsSection = () => {
  const [notifications, setNotifications] = useState({
    proposals: true,
    votes: true,
    transactions: false,
    security: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-border/50 bg-card/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Profile</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-background font-bold">ZK</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Anonymous User</p>
                <p className="text-sm text-muted-foreground font-mono">zkid_0x7a3d...8f2e</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Display Name</label>
              <input
                type="text"
                placeholder="Anonymous"
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Email (Optional)</label>
              <input
                type="email"
                placeholder="For notifications only"
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Wallet Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl border border-border/50 bg-card/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Connected Wallets</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <span className="text-orange-500 font-bold text-sm">MM</span>
              </div>
              <div>
                <p className="font-mono text-foreground">0x7a3d...8f2e</p>
                <p className="text-xs text-muted-foreground">MetaMask • Primary</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs">Connected</span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Key className="w-4 h-4" />
            Connect Another Wallet
          </Button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl border border-border/50 bg-card/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Notifications</h3>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground capitalize">{key}</p>
                <p className="text-sm text-muted-foreground">
                  {key === 'proposals' && 'Get notified about new proposals'}
                  {key === 'votes' && 'Reminders for active votes'}
                  {key === 'transactions' && 'Transaction confirmations'}
                  {key === 'security' && 'Security alerts and warnings'}
                </p>
              </div>
              <button
                onClick={() => setNotifications(n => ({ ...n, [key]: !value }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  value ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <motion.div
                  animate={{ x: value ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-background"
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl border border-border/50 bg-card/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Security</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add extra security to your account</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div>
              <p className="font-medium text-foreground">Session Management</p>
              <p className="text-sm text-muted-foreground">View and manage active sessions</p>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div>
              <p className="font-medium text-foreground">ZK Identity Backup</p>
              <p className="text-sm text-muted-foreground">Export your ZK identity keys</p>
            </div>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-border/50 bg-card/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Always on for maximum privacy</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Always On</span>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="glow" onClick={handleSave}>
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingsSection;
