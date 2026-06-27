import { motion } from 'framer-motion';
import JoinForm from '../components/JoinForm';
import Icon from '../components/Icon';

export default function Join() {
  return (
    <section id="join" className="section join">
      <motion.span className="label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        // initiate launch sequence
      </motion.span>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Ready to launch?
      </motion.h2>
      <p className="lead" style={{ margin: '14px auto 0' }}>
        Applications open for Semester 3 induction. Pick your orbit and we'll find your place in the galaxy.
      </p>

      <JoinForm />

      <div className="join-foot">
        Deadline: <strong style={{ color: 'var(--text)' }}>12 July 2026</strong> · Questions?{' '}
        <a href="#" onClick={(e) => e.preventDefault()}><Icon name="instagram" size={15} /> @codegalaxy</a>
      </div>
    </section>
  );
}
