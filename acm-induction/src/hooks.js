import { useEffect, useRef, useState } from 'react';

// Typewriter — reveals `text` one char at a time once `start` is true.
export function useTypewriter(text, { speed = 42, start = true, delay = 0 } = {}) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
    let i = 0;
    let timer;
    const begin = setTimeout(function step() {
      setOut(text.slice(0, i));
      if (i <= text.length) {
        i += 1;
        timer = setTimeout(step, speed);
      } else {
        setDone(true);
      }
    }, delay);
    return () => {
      clearTimeout(begin);
      clearTimeout(timer);
    };
  }, [text, speed, start, delay]);
  return { text: out, done };
}

// Returns [ref, inView] — true while the element is on (or near) screen.
// Used to pause off-screen WebGL canvases (frameloop="never") so they
// stop eating GPU/CPU when scrolled away.
export function useInViewport(rootMargin = '250px') {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView];
}

// Tracks whether viewport is below a breakpoint (default mobile <768).
export function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);
  return mobile;
}

// Scroll-spy — returns the id of the section currently in view.
export function useScrollSpy(ids, offset = 220) {
  const key = ids.join(',');
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const list = key.split(',');
    const onScroll = () => {
      const y = window.scrollY + offset;
      let current = list[0];
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [key, offset]);
  return active;
}

// Count-up animation, triggered once when `active` becomes true.
export function useCountUp(target, { duration = 1500, active = false } = {}) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOut
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}
