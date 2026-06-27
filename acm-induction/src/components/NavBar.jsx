import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { NAV_LINKS } from '../data/content';
import { useScrollSpy } from '../hooks';

const IDS = ['hero', ...NAV_LINKS.map((l) => l.id)];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#hero" className="brand" onClick={go('hero')}>
          <span className="mark"><Icon name="rocket" size={18} /></span>
          <span className="brand-text">
            ACM Student Chapter
            <small>Web &amp; App Dev · Amrita</small>
          </span>
        </a>

        <div className="nav-right">
          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className={active === l.id ? 'active' : ''}>
                {active === l.id && (
                  <motion.span
                    layoutId="navPill"
                    className="nav-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="nav-label">{l.label}</span>
              </a>
            ))}
          </div>
          <button className="nav-cta" onClick={go('join')}>Apply now</button>
          <button className="hamburger" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Icon name="menu" size={24} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="close" aria-label="Close menu" onClick={() => setOpen(false)}>
              <Icon name="x" size={26} />
            </button>
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l.id} href={`#${l.id}`} onClick={go(l.id)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.1 }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.button
              className="nav-cta" onClick={go('join')}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * NAV_LINKS.length + 0.1 }}
            >
              Apply now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
