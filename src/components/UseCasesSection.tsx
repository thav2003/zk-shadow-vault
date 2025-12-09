import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Building2, Users, Briefcase, TrendingUp, ChevronDown } from 'lucide-react';

const useCases = [
  {
    icon: Building2,
    title: 'Institutional Funds',
    description: 'Hedge funds and asset managers can execute trades without revealing strategy or positions.',
    benefits: [
      'Hidden NAV tracking',
      'Private strategy allocation',
      'Compliant ZK proofs',
      'No front-running risk',
    ],
  },
  {
    icon: Users,
    title: 'DAO Treasury',
    description: 'Decentralized organizations can govern funds with complete voting privacy.',
    benefits: [
      'Anonymous governance',
      'Role-based permissions',
      'Hidden treasury balance',
      'Private proposal voting',
    ],
  },
  {
    icon: Briefcase,
    title: 'OTC Trading Desks',
    description: 'Large block trades executed privately without market impact or information leakage.',
    benefits: [
      'Stealth transactions',
      'Zero slippage risk',
      'Private counterparty matching',
      'Encrypted order flow',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Syndicate Investments',
    description: 'Investment syndicates can pool capital and make decisions without revealing member identities.',
    benefits: [
      'Anonymous LP participation',
      'Private capital calls',
      'Hidden member list',
      'ZK share proofs',
    ],
  },
];

const UseCaseCard = ({ useCase, index, isExpanded, onToggle }: { 
  useCase: typeof useCases[0]; 
  index: number; 
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div 
        className={`relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
          isExpanded 
            ? 'border-primary bg-primary/5' 
            : 'border-border/50 bg-card/30 hover:border-primary/50'
        }`}
        onClick={onToggle}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <useCase.icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">{useCase.title}</h3>
            <p className="text-sm text-muted-foreground">{useCase.description}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>

        {/* Expanded content */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-3">
              {useCase.benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Glow effect on hover/expand */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none"
          />
        )}
      </div>
    </motion.div>
  );
};

const UseCasesSection = () => {
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true });
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      </div>

      <div className="container relative px-4">
        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full border border-secondary/30 text-secondary text-sm font-mono mb-4">
            Use Cases
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Built for <span className="neon-text-pink">Privacy</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From institutional funds to DAOs—ZKFund provides the privacy infrastructure 
            for any organization that values confidentiality.
          </p>
        </motion.div>

        {/* Use case cards */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <UseCaseCard
              key={useCase.title}
              useCase={useCase}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
