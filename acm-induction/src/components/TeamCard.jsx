import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { initials } from '../data/content';

const R = 47;
const CIRC = 2 * Math.PI * R;

export default function TeamCard({ member, index }) {
  const [flipped, setFlipped] = useState(false);
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <motion.div
      className={`flip ${flipped ? 'flipped' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => coarse && setFlipped((f) => !f)}
    >
      <div className="flip-inner">
        {/* front */}
        <div className="face front">
          <div className="avatar-wrap">
            <svg className="avatar-ring" viewBox="0 0 100 100">
              <motion.circle
                cx="50" cy="50" r={R} stroke={member.c2}
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                whileInView={{ strokeDashoffset: CIRC * 0.25 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 + 0.3, duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="avatar" style={{ background: `linear-gradient(135deg, ${member.c1}, ${member.c2})` }}>
              {initials(member.name)}
            </div>
          </div>
          <h3>{member.name}</h3>
          <div className="role">{member.role}</div>
          <span className="badge">{member.specialty}</span>
        </div>
        {/* back */}
        <div className="face back">
          <h3>{member.name}</h3>
          <p className="bio">{member.bio}</p>
          <span className="badge" style={{ marginBottom: 16 }}>{member.specialty}</span>
          <div className="socials">
            <a href="#" onClick={(e) => e.preventDefault()} aria-label={`${member.name} on GitHub`}><Icon name="github" size={18} /></a>
            <a href="#" onClick={(e) => e.preventDefault()} aria-label={`${member.name} on LinkedIn`}><Icon name="linkedin" size={18} /></a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
