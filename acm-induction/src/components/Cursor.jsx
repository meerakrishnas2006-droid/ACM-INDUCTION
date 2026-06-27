import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a,button,.planet-node,.dchip,.flip,.pcard,.filter-btn,.domain-tile,input,select,textarea';

// Glowing dot + trailing ring. Hidden on touch via CSS.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let mx = 0, my = 0, rx = 0, ry = 0, raf;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) { dot.current.style.left = `${mx}px`; dot.current.style.top = `${my}px`; }
    };
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (ring.current) { ring.current.style.left = `${rx}px`; ring.current.style.top = `${ry}px`; }
      raf = requestAnimationFrame(loop);
    };
    const over = (e) => { if (e.target.closest?.(INTERACTIVE)) ring.current?.classList.add('active'); };
    const out = (e) => { if (e.target.closest?.(INTERACTIVE)) ring.current?.classList.remove('active'); };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    loop();
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
