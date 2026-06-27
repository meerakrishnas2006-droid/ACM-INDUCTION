import { motion } from 'framer-motion';
import TeamCard from '../components/TeamCard';
import { CREW } from '../data/content';

export default function Team() {
  return (
    <section id="team" className="section team">
      <motion.span className="label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        // crew manifest
      </motion.span>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Meet the crew
      </motion.h2>

      <div className="crew-row">
        {CREW.map((m, i) => <TeamCard key={m.name} member={m} index={i} />)}
      </div>
    </section>
  );
}
