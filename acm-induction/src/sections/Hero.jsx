import { motion } from 'framer-motion';
import Icon from '../components/Icon';
import { useTypewriter } from '../hooks';

const scrollTo = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};
const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const { text } = useTypewriter('"Where code meets the cosmos."', { start: true, delay: 1600 });

  return (
    <header id="hero" className="hero">
      {/* Storm background (App-level) shows through; hero-glow adds local depth */}
      <div className="hero-glow" aria-hidden="true" />

      <motion.div className="hero-content" variants={container} initial="hidden" animate="show">
        <motion.div className="hero-pill" variants={item}>
          <span className="dot" /> Semester 3 induction · applications open
        </motion.div>

        <motion.h1 className="hero-title" variants={item}>ACM Student Chapter</motion.h1>

        <motion.p className="hero-deck" variants={item}>
          The Web &amp; App Development Club at <strong>Amrita Vishwa Vidyapeetham</strong> — where first commits become shipped products.
        </motion.p>

        <motion.div className="hero-tagline" variants={item}>
          {text}<span className="caret" />
        </motion.div>

        <motion.div className="cta-row" variants={item}>
          <button className="btn primary sheen" onClick={scrollTo('about')}>
            Enter the galaxy <Icon name="arrowRight" size={16} />
          </button>
          <button className="btn ghost" onClick={scrollTo('join')}>Apply now</button>
        </motion.div>

        <motion.div className="hero-stats" variants={item}>
          <div><b>120+</b><span>MEMBERS</span></div>
          <span className="sep" />
          <div><b>34</b><span>PROJECTS SHIPPED</span></div>
          <span className="sep" />
          <div><b>6</b><span>SEMESTERS</span></div>
        </motion.div>
      </motion.div>

      <motion.div className="scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
        <div className="ring" />
        <span>SCROLL</span>
      </motion.div>
    </header>
  );
}
