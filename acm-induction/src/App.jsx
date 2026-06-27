import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './styles.css';

import StormBackground from './three/StormBackground';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import LoadingScreen from './components/LoadingScreen';
import NavBar from './components/NavBar';

import Hero from './sections/Hero';
import About from './sections/About';
import Domains from './sections/Domains';
import Projects from './sections/Projects';
import Team from './sections/Team';
import Join from './sections/Join';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // hard cap at 1.6s so users never wait on the loader
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen key="loader" />}</AnimatePresence>

      <StormBackground />
      <Cursor />
      <ScrollProgress />
      <NavBar />

      <main>
        <Hero />
        <About />
        <Domains />
        <Projects />
        <Team />
        <Join />
      </main>

      <footer className="footer">
        Built with code &amp; cosmic curiosity · Web &amp; App Development Club, Amrita Vishwa Vidyapeetham · 2026
      </footer>
    </>
  );
}
