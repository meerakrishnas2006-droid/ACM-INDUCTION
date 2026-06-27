import { motion } from 'framer-motion';

// Animated constellation line that draws itself on scroll-enter.
export default function ConstellationDivider() {
  return (
    <div className="divider" aria-hidden="true">
      <motion.svg viewBox="0 0 1200 36" preserveAspectRatio="none">
        <motion.line
          x1="0" y1="18" x2="1200" y2="18"
          stroke="rgba(124,111,247,0.35)" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        {[160, 420, 600, 780, 1040].map((cx, i) => (
          <motion.circle
            key={cx}
            cx={cx} cy="18" r="3"
            fill={i % 2 ? '#1dc891' : '#7c6ff7'}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.4, ease: 'backOut' }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
