import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../hooks';

const STATS = [
  { target: 120, suffix: '+', label: 'members across batches' },
  { target: 34, suffix: '', label: 'projects shipped' },
  { target: 6, suffix: '', label: 'semesters running' },
];

function StatOrb({ stat, active, delay }) {
  const value = useCountUp(stat.target, { active });
  const finished = value === stat.target;
  return (
    <motion.div
      className={`orb ${finished ? 'pulsed' : ''}`}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ring">{value}{stat.suffix}</div>
      <div className="meta">{stat.label}</div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section id="about" className="section" ref={ref}>
      <motion.span className="label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        // mission briefing
      </motion.span>
      <div className="about-grid">
        <motion.div
          className="about-copy"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="section-title" style={{ marginBottom: 20 }}>We build things that matter.</h2>
          <p>We are the <strong>Web &amp; App Development Club</strong> — a student-led collective that turns ideas into shipped products. From hackathons to client projects, every semester we build something real.</p>
          <p>Whether you write CSS or train PyTorch models, design flows or debug Docker containers — <strong>there's a domain for you here.</strong></p>
        </motion.div>

        <motion.div
          className="stat-orbs"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {STATS.map((s, i) => <StatOrb key={s.label} stat={s} active={inView} delay={0.2 + i * 0.12} />)}
        </motion.div>
      </div>
    </section>
  );
}
