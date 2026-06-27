import { motion } from 'framer-motion';
import Icon from './Icon';

// Seeded tilt so each "asteroid" sits at its own angle.
const tilt = (i) => [-2, 1.5, -1.2, 2, -1.8, 1, -2.4, 1.6][i % 8];

export default function ProjectCard({ project, index }) {
  const angle = tilt(index);
  return (
    <motion.article
      className="pcard"
      layout
      initial={{ opacity: 0, scale: 0.9, rotate: angle }}
      animate={{
        opacity: 1, scale: 1, rotate: angle,
        y: [0, -7, 0],
      }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 5 + (index % 4), repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 },
      }}
      whileHover={{ y: -10, rotate: 0, borderColor: project.color, boxShadow: `0 18px 50px ${project.color}40` }}
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="picon" style={{ background: `linear-gradient(135deg, ${project.color}44, ${project.color}11)`, color: project.color }}>
        <Icon name="rocket" size={24} />
      </div>
      <h3>{project.name}</h3>
      <p className="pdesc">{project.desc}</p>
      <div className="ptags">
        {project.tech.map((t) => (
          <span key={t} className="ptag">{t}</span>
        ))}
      </div>
      <span className="pview">View project <Icon name="arrowRight" size={14} /></span>
    </motion.article>
  );
}
