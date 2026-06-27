import { useRef, useState } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { PROJECTS, PROJECT_FILTERS } from '../data/content';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const beltRef = useRef(null);

  const shown = PROJECTS.filter((p) => filter === 'all' || p.domain === filter);

  // wheel → horizontal scroll on desktop
  const onWheel = (e) => {
    const el = beltRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
    }
  };

  return (
    <section id="projects" className="section projects">
      <motion.span className="label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        // asteroid field
      </motion.span>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Things we've shipped
      </motion.h2>

      <div className="filters" role="group" aria-label="Filter projects">
        {PROJECT_FILTERS.map((f) => (
          <button
            key={f.id}
            className={`filter-btn ${filter === f.id ? 'active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <LayoutGroup>
        <div className="belt" ref={beltRef} onWheel={onWheel}>
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <ProjectCard key={p.id} project={p} index={PROJECTS.indexOf(p)} />
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </section>
  );
}
