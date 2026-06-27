import { useState } from 'react';
import { motion } from 'framer-motion';
import DomainPanel from '../components/DomainPanel';
import Icon from '../components/Icon';
import { DOMAINS } from '../data/content';

function DomainCard({ domain, index, onSelect }) {
  // cursor spotlight → CSS vars
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <motion.button
      className="dcard"
      style={{ '--accent': domain.color }}
      onMouseMove={onMove}
      onClick={() => onSelect(domain.id)}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`${domain.name} — ${domain.openRoles} roles open`}
    >
      <div className="dcard-icon"><Icon name={domain.icon} size={24} /></div>
      <h3>{domain.name}</h3>
      <p>{domain.description}</p>
      <div className="dcard-tech">
        {domain.tech.slice(0, 3).map((t) => <span key={t}>{t}</span>)}
      </div>
      <div className="dcard-foot">
        <span className="roles">{domain.openRoles} roles open</span>
        <span className="go"><Icon name="arrowRight" size={18} /></span>
      </div>
    </motion.button>
  );
}

export default function Domains() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = DOMAINS.find((d) => d.id === selectedId) || null;

  return (
    <section id="domains" className="section domains">
      <motion.span className="label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        // constellation map
      </motion.span>
      <motion.h2
        className="section-title" style={{ marginBottom: 16 }}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Six domains, one galaxy
      </motion.h2>
      <p className="lead" style={{ margin: '0 auto' }}>
        Each domain orbits the same mission. Select a card to explore its tech stack and open roles.
      </p>

      <div className="domain-grid">
        {DOMAINS.map((d, i) => (
          <DomainCard key={d.id} domain={d} index={i} onSelect={setSelectedId} />
        ))}
      </div>

      <DomainPanel domain={selected} onClose={() => setSelectedId(null)} />
    </section>
  );
}
