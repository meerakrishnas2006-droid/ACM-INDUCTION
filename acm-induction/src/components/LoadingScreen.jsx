import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      <motion.div
        className="loader-star"
        exit={{ scale: 2.4, opacity: 0, transition: { duration: 0.6 } }}
      />
      <div className="loader-text">Initialising galaxy</div>
    </motion.div>
  );
}
