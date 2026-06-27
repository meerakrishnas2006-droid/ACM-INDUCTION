import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';

export default function DomainPanel({ domain, onClose }) {
  return (
    <AnimatePresence>
      {domain && (
        <motion.aside
          className="domain-panel"
          role="dialog"
          aria-label={`${domain.name} details`}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="close" aria-label="Close panel" onClick={onClose}>
            <Icon name="x" size={24} />
          </button>
          <div className="pico" style={{ background: `${domain.color}22`, border: `1px solid ${domain.color}55`, color: domain.color }}>
            <Icon name={domain.icon} size={28} />
          </div>
          <h3>{domain.name}</h3>
          <p>{domain.description}</p>
          <div className="label" style={{ marginBottom: 10 }}>// tech stack</div>
          <div className="chips">
            {domain.tech.map((t) => (
              <span key={t} className="chip" style={{ color: domain.color, borderColor: `${domain.color}55` }}>{t}</span>
            ))}
          </div>
          <span className="roles-badge" style={{ color: domain.color }}>
            <Icon name="rocket" size={16} /> {domain.openRoles} roles open
          </span>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
