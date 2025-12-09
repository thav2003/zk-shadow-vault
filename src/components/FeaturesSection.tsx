import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Vote, Wallet, Shield, Eye, Lock, Fingerprint } from 'lucide-react';

const features = [
  {
    icon: Vote,
    title: 'ZK DAO Governance',
    description: 'Private, multi-role zero-knowledge governance. Anonymous voting with weighted options and hidden quorum.',
    color: 'from-neon-cyan to-blue-500',
    highlights: ['Anonymous Voting', 'Role-based Access', 'Hidden Results'],
  },
  {
    icon: Wallet,
    title: 'ZK OTC / Private Fund',
    description: 'Private OTC vaults for institutions and trading desks. All operations happen inside ZK Pool.',
    color: 'from-neon-pink to-purple-500',
    highlights: ['Stealth Treasury', 'Private Swap', 'Hidden NAV'],
  },
  {
    icon: Shield,
    title: 'ZK Multisig',
    description: 'Multi-signature execution with zero-knowledge proofs. Prove consensus without revealing signers.',
    color: 'from-green-400 to-emerald-500',
    highlights: ['3/5 Threshold', 'Private Signatures', 'Instant Execution'],
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`} />
      
      {/* Card */}
      <div className="relative h-full p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 overflow-hidden">
        {/* Circuit pattern */}
        <div className="absolute inset-0 bg-circuit-pattern opacity-5" />
        
        {/* Icon */}
        <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-0.5 mb-6`}>
          <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
            <feature.icon className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
        <p className="text-muted-foreground mb-6">{feature.description}</p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2">
          {feature.highlights.map((highlight) => (
            <span
              key={highlight}
              className="px-3 py-1 text-xs font-mono rounded-full border border-primary/30 text-primary bg-primary/5"
            >
              {highlight}
            </span>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 border border-primary/10 rounded-full" />
        <div className="absolute top-8 right-8 w-12 h-12 border border-primary/5 rounded-full" />
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true });

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container px-4">
        {/* Section header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full border border-primary/30 text-primary text-sm font-mono mb-4">
            Core Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy-First <span className="gradient-text">Infrastructure</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with zero-knowledge proofs to ensure complete privacy for governance, 
            fund management, and execution.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Additional features grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          {[
            { icon: Eye, label: 'Hidden Votes' },
            { icon: Lock, label: 'Encrypted Actions' },
            { icon: Fingerprint, label: 'ZK Identity' },
            { icon: Shield, label: 'Compliance Proofs' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/30"
            >
              <item.icon className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
