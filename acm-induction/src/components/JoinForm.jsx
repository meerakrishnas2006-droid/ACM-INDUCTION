import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import AboutPlanet from '../three/AboutPlanet';
import { BRANCHES, DOMAINS } from '../data/content';

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.(ac\.in|edu)$/i.test(v.trim());

const FIELDS = ['name', 'roll', 'branch', 'email', 'domains', 'why'];

export default function JoinForm() {
  const [values, setValues] = useState({ name: '', roll: '', branch: '', email: '', why: '' });
  const [picked, setPicked] = useState([]);
  const [errors, setErrors] = useState({});
  const [launching, setLaunching] = useState(false);
  const [done, setDone] = useState(false);
  const btnRef = useRef(null);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = (k) => {
    let ok = true;
    if (k === 'domains') ok = picked.length > 0;
    else if (k === 'email') ok = emailOk(values.email);
    else ok = (values[k] || '').trim().length > 0;
    setErrors((e) => ({ ...e, [k]: !ok }));
    return ok;
  };

  const toggleChip = (id) => {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    setErrors((e) => ({ ...e, domains: false }));
  };

  const fireRocket = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const rocket = document.createElement('div');
    rocket.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1dc891" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 1.5 4.5 4.5 4.5 8 0 1.6-.6 3.2-1.5 4.5h-6c-.9-1.3-1.5-2.9-1.5-4.5C7.5 7.5 9 4.5 12 3Z"/><circle cx="12" cy="9.5" r="1.4"/><path d="M9 15.5c-1.5.5-2.5 2-2.5 4 1.3 0 2.4-.5 3-1.3M15 15.5c1.5.5 2.5 2 2.5 4-1.3 0-2.4-.5-3-1.3"/></svg>';
    rocket.style.cssText = `position:fixed;left:${r.left + r.width / 2 - 15}px;top:${r.top - 6}px;z-index:9999;pointer-events:none;filter:drop-shadow(0 0 8px #1dc891);`;
    document.body.appendChild(rocket);
    rocket.animate(
      [{ transform: 'translateY(0) rotate(-8deg)', opacity: 1 }, { transform: `translateY(-${r.top + 160}px) rotate(-14deg)`, opacity: 0 }],
      { duration: 1000, easing: 'cubic-bezier(0.4,0,0.6,1)' }
    ).onfinish = () => rocket.remove();
  };

  const fireConfetti = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const x0 = r.left + r.width / 2, y0 = r.top + r.height / 2;
    const colors = ['#7c6ff7', '#1dc891', '#f0a500', '#378add', '#d4537e'];
    for (let i = 0; i < 52; i++) {
      const p = document.createElement('div');
      const size = 4 + Math.random() * 5;
      const col = colors[i % colors.length];
      p.style.cssText = `position:fixed;left:${x0}px;top:${y0}px;width:${size}px;height:${size}px;border-radius:50%;background:${col};box-shadow:0 0 6px ${col};z-index:9998;pointer-events:none;`;
      document.body.appendChild(p);
      const ang = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 170;
      p.animate(
        [{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist - 40}px) scale(0)`, opacity: 0 }],
        { duration: 800 + Math.random() * 500, easing: 'cubic-bezier(0.34,1.56,0.64,1)' }
      ).onfinish = () => p.remove();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const results = FIELDS.map(validate);
    if (results.some((ok) => !ok)) {
      const firstBad = FIELDS.find((k, i) => !results[i]);
      document.querySelector(`[data-field="${firstBad}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setLaunching(true);
    fireRocket();
    fireConfetti();
    setTimeout(() => setDone(true), 900);
  };

  const whyLen = values.why.length;
  const counterColor = whyLen > 195 ? '#ff7a7a' : whyLen > 160 ? 'var(--amber)' : 'var(--muted)';

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div
          key="success"
          className="console success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ width: 130, height: 130, margin: '0 auto 22px' }}>
            <AboutPlanet tint="#1dc891" />
          </div>
          <h3>You're in the queue, astronaut.</h3>
          <p>We'll reach out at <strong style={{ color: 'var(--text)' }}>{values.email}</strong> within 48 hours. Keep an eye on your inbox — and your orbit.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          className="console"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          animate={launching ? { opacity: 0, transition: { delay: 0.5, duration: 0.4 } } : {}}
        >
          <Field label="Full name" name="name" error={errors.name} msg="Please enter your name.">
            <input type="text" autoComplete="name" value={values.name} onChange={set('name')} onBlur={() => validate('name')} />
          </Field>

          <Field label="College roll number" name="roll" error={errors.roll} msg="Please enter your roll number.">
            <input type="text" value={values.roll} onChange={set('roll')} onBlur={() => validate('roll')} />
          </Field>

          <Field label="Branch & year" name="branch" error={errors.branch} msg="Please select your branch & year.">
            <select value={values.branch} onChange={set('branch')} onBlur={() => validate('branch')}>
              <option value="">Select…</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>

          <Field label="Email" name="email" error={errors.email} msg="Use a valid .ac.in or .edu email address.">
            <input type="email" inputMode="email" autoComplete="email" placeholder="you@college.ac.in" value={values.email} onChange={set('email')} onBlur={() => validate('email')} />
            {emailOk(values.email) && <span className="ok-check"><Icon name="check" size={18} /></span>}
          </Field>

          <div className="field" data-field="domains">
            <label>Domain preference <span className="req">*</span></label>
            <div className="dchips" role="group" aria-label="Domain preference">
              {DOMAINS.map((d) => {
                const on = picked.includes(d.id);
                return (
                  <button
                    type="button" key={d.id}
                    className={`dchip ${on ? 'on' : ''}`}
                    aria-pressed={on}
                    onClick={() => toggleChip(d.id)}
                    style={on ? { color: d.color, borderColor: d.color, boxShadow: `0 0 16px -2px ${d.color}` } : undefined}
                  >
                    {d.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
            {errors.domains && <div className="err" role="alert">Select at least one domain.</div>}
          </div>

          <div className="field" data-field="why">
            <label>Why do you want to join?</label>
            <textarea rows="3" maxLength="200" value={values.why} onChange={set('why')} onBlur={() => validate('why')} />
            <div className="counter" style={{ color: counterColor }}>{whyLen}/200</div>
            {errors.why && <div className="err" role="alert">Tell us a little about why you'd like to join.</div>}
          </div>

          <button ref={btnRef} type="submit" className="launch-btn" disabled={launching}>
            {launching ? 'Launching…' : <>Launch application <Icon name="rocket" size={18} /></>}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({ label, name, error, msg, children }) {
  return (
    <div className={`field ${error ? 'invalid' : ''}`} data-field={name}>
      <label>{label} <span className="req">*</span></label>
      <div className="input-wrap">{children}</div>
      {error && <div className="err" role="alert">{msg}</div>}
    </div>
  );
}
