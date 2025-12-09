import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Plus, Upload, FileText, KeyRound, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Plus,
    title: 'Create Fund',
    description: 'Initialize a private fund with ZK Treasury. Define roles: Founder, Board, Trader, Auditor.',
    code: `fund_id: zkfund_01
signers: 3/5 multisig
roles: [Founder, Board, Trader]`,
  },
  {
    icon: Upload,
    title: 'Deposit Capital',
    description: 'LPs deposit funds into ZK Pool. Balances are recorded anonymously with zero knowledge.',
    code: `action: DEPOSIT
amount: 200,000 USDC
proof: zk_balance_proof`,
  },
  {
    icon: FileText,
    title: 'Create Proposal',
    description: 'Fund Manager submits private action proposal. Metadata is encrypted, only proof is public.',
    code: `type: WITHDRAW
amount: 10,000 USDC
required: 3/5 signatures`,
  },
  {
    icon: KeyRound,
    title: 'ZK Multisig',
    description: 'Signers create ZK proofs. Each proves membership without revealing identity.',
    code: `signer_A → proof_A ✓
signer_B → proof_B ✓
signer_C → proof_C ✓`,
  },
  {
    icon: CheckCircle,
    title: 'Private Execution',
    description: 'Action executed via stealth address. Complete trace privacy maintained.',
    code: `status: EXECUTED
recipient: stealth_addr
trace: PRIVATE`,
  },
];

const WorkflowSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full border border-primary/30 text-primary text-sm font-mono mb-4">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Complete <span className="gradient-text">Workflow</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From fund creation to private execution—every step protected by zero-knowledge proofs.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-primary" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                    className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                  >
                    <step.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'} pl-24 md:pl-0`}>
                  <div className={`${index % 2 === 0 ? 'md:ml-auto' : ''} max-w-md`}>
                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    
                    {/* Code block */}
                    <div className="relative rounded-lg bg-card/80 border border-border p-4 font-mono text-sm overflow-hidden">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-destructive/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                      </div>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap mt-4">
                        {step.code}
                      </pre>
                      {/* Scanline effect */}
                      <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
