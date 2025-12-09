import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { User, Vote, Cpu, Database, ArrowRight } from 'lucide-react';

const layers = [
  {
    id: 'identity',
    icon: User,
    title: 'Identity Layer',
    items: ['ZK Identity (zkID)', 'ZK Membership', 'Anonymous Session Keys'],
    color: 'neon-cyan',
  },
  {
    id: 'voting',
    icon: Vote,
    title: 'Voting Layer',
    items: ['ZK Voting Circuits (SNARK)', 'Weighted Voting', 'Hidden Quorum'],
    color: 'neon-pink',
  },
  {
    id: 'execution',
    icon: Cpu,
    title: 'Execution Layer',
    items: ['ZK Multisig', 'Private Action Proofs', 'Threshold Signatures'],
    color: 'neon-purple',
  },
  {
    id: 'settlement',
    icon: Database,
    title: 'Settlement Layer',
    items: ['Private Settlement', 'ZK Pool Integration', 'Proof-only Logging'],
    color: 'green-400',
  },
];

const ArchitectureSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % layers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container relative px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full border border-secondary/30 text-secondary text-sm font-mono mb-4">
            Architecture
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Multi-Layer <span className="neon-text-pink">ZK Protocol</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four interconnected layers working together to provide complete privacy 
            from identity to settlement.
          </p>
        </motion.div>

        {/* Architecture diagram */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--neon-cyan))" stopOpacity="0.3" />
                <stop offset="50%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--neon-cyan))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Layers */}
          <div className="relative space-y-4">
            {layers.map((layer, index) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative p-6 rounded-xl border transition-all duration-500 ${
                  activeLayer === index
                    ? 'border-primary bg-primary/5 shadow-[0_0_30px_hsl(var(--primary)/0.3)]'
                    : 'border-border/50 bg-card/30'
                }`}
                onMouseEnter={() => setActiveLayer(index)}
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-${layer.color}/10 flex items-center justify-center`}>
                    <layer.icon className={`w-6 h-6 text-${layer.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">{layer.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {layer.items.map((item, i) => (
                        <motion.span
                          key={item}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={activeLayer === index ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="px-3 py-1 text-xs font-mono rounded-full border border-border bg-background/50 text-muted-foreground"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Flow indicator */}
                  {index < layers.length - 1 && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Active indicator */}
                {activeLayer === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gradient-to-b from-primary to-secondary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Data flow animation */}
          <motion.div
            className="absolute right-0 top-0 w-2 h-full"
            style={{ opacity: 0.3 }}
          >
            <motion.div
              className="w-full bg-gradient-to-b from-neon-cyan via-neon-pink to-neon-cyan"
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ height: '30%' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
