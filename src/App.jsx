import { useEffect, useMemo, useRef, useState } from 'react';

const wishes = [
  'May this year bring you bold opportunities and beautiful peace.',
  'May your smile stay bright and your confidence stay unstoppable.',
  'May every dream you whisper become a memory you live.',
  'May your days be soft where they need to be and strong where they must be.'
];

const qualities = [
  { title: 'Kind Heart', text: 'You make people feel seen, safe, and appreciated.' },
  { title: 'Bright Energy', text: 'Your vibe can turn an ordinary day into a fun one.' },
  { title: 'Fearless Spirit', text: 'You chase growth with courage and style.' },
  { title: 'Elegant Mind', text: 'You bring grace and intelligence into every room.' }
];

const memories = [
  { src: '/memory-1.svg', alt: 'Golden birthday glow for Cynthia', caption: 'Golden Girl Energy' },
  { src: '/memory-2.svg', alt: 'Pink floral memory card for Cynthia', caption: 'Soft & Beautiful' },
  { src: '/memory-3.svg', alt: 'Celebration stars for Cynthia birthday', caption: 'Star Of The Day' }
];

const noteMap = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  C5: 523.25
};

function playBirthdayMelody() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const now = ctx.currentTime + 0.05;

  const melody = [
    ['C4', 0.3], ['C4', 0.25], ['D4', 0.45], ['C4', 0.45], ['F4', 0.45], ['E4', 0.7],
    ['C4', 0.3], ['C4', 0.25], ['D4', 0.45], ['C4', 0.45], ['G4', 0.45], ['F4', 0.7],
    ['C4', 0.3], ['C4', 0.25], ['C5', 0.45], ['A4', 0.45], ['F4', 0.45], ['E4', 0.45], ['D4', 0.7],
    ['Bb4', 0.3], ['Bb4', 0.25], ['A4', 0.45], ['F4', 0.45], ['G4', 0.45], ['F4', 0.8]
  ];

  let cursor = now;
  melody.forEach(([note, duration], index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = index % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.value = noteMap[note] || 440;

    filter.type = 'lowpass';
    filter.frequency.value = 1800;

    gain.gain.setValueAtTime(0, cursor);
    gain.gain.linearRampToValueAtTime(0.17, cursor + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, cursor + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(cursor);
    osc.stop(cursor + duration + 0.02);

    cursor += duration;
  });
}

function Fireworks({ trigger }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const createBurst = (x, y, count) => {
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 3.2 + 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: Math.random() * 55 + 45,
          hue: Math.floor(Math.random() * 360),
          size: Math.random() * 2.5 + 1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(5, 15, 40, 0.14)';
      ctx.fillRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.life -= 1;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${Math.max(p.life / 70, 0)})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    createBurst(width * 0.25, height * 0.35, 65);
    createBurst(width * 0.75, height * 0.32, 65);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [trigger]);

  return <canvas className="fireworks" ref={canvasRef} aria-hidden="true" />;
}

export default function App() {
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [fireworksTrigger, setFireworksTrigger] = useState(0);
  const [secondsOnPage, setSecondsOnPage] = useState(0);
  const [typedIntro, setTypedIntro] = useState('');

  const introMessage = 'Pookie Cynthia, today the world celebrates your magic.';

  useEffect(() => {
    const timer = setInterval(() => setSecondsOnPage((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let index = 0;
    const typer = setInterval(() => {
      index += 1;
      setTypedIntro(introMessage.slice(0, index));
      if (index >= introMessage.length) {
        clearInterval(typer);
      }
    }, 42);

    return () => clearInterval(typer);
  }, [introMessage]);

  const sparkles = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${Math.random() * 5 + 4}s`
    })),
    []
  );

  const openSurprise = () => {
    setSurpriseOpen(true);
    setFireworksTrigger((prev) => prev + 1);
  };

  return (
    <>
      <Fireworks trigger={fireworksTrigger} />
      <div className="bg-blur bg-blur-a" />
      <div className="bg-blur bg-blur-b" />

      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="sparkle"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            animationDelay: sparkle.delay,
            animationDuration: sparkle.duration
          }}
        />
      ))}

      <main className="site-shell">
        <section className="hero card">
          <p className="eyebrow">A Special Day</p>
          <h1>Happy Birthday, Cynthia</h1>
          <p className="typed-intro">{typedIntro}</p>
          <p className="lead">
            Today is all about your light, your laughter, and the beautiful way you make life feel warmer.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={openSurprise}>Open Surprise</button>
            <button className="btn-secondary" onClick={playBirthdayMelody}>Play Birthday Melody</button>
          </div>
          <p className="tiny">Celebration timer: {secondsOnPage}s of birthday vibes</p>
        </section>

        <section className="grid-section">
          {wishes.map((wish, idx) => (
            <article key={wish} className="wish-card card" style={{ animationDelay: `${idx * 120}ms` }}>
              <h2>Wish {idx + 1}</h2>
              <p>{wish}</p>
            </article>
          ))}
        </section>

        <section className="qualities card">
          <h2>Why Cynthia Is Amazing</h2>
          <div className="qualities-grid">
            {qualities.map((item) => (
              <article key={item.title} className="quality-item">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery card">
          <h2>Birthday Memory Gallery</h2>
          <p className="gallery-subtitle">Little snapshots of the vibe: elegant, warm, and unforgettable.</p>
          <div className="gallery-grid">
            {memories.map((memory) => (
              <figure key={memory.caption} className="memory-card">
                <img src={memory.src} alt={memory.alt} loading="lazy" />
                <figcaption>{memory.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={`surprise card ${surpriseOpen ? 'open' : ''}`}>
          <h2>Your Birthday Message</h2>
          <p>
            Cynthia, keep shining exactly the way you do. You deserve a year full of joy, deep peace,
            and unforgettable wins. Happy birthday, beautiful soul.
          </p>
          <p className="signature">With love and celebration</p>
        </section>
      </main>
    </>
  );
}
