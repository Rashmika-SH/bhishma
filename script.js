/* ============================================================
   COSMOS CANVAS BACKGROUND
   ============================================================ */
(function () {
  const canvas = document.getElementById('cosmos-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const STAR_COUNT = 320;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.6 + 0.2,
    alpha: Math.random() * 0.7 + 0.3,
    speed: Math.random() * 0.004 + 0.001,
    phase: Math.random() * Math.PI * 2,
    color: Math.random() > 0.85 ? '#f5c842' : Math.random() > 0.7 ? '#a78bfa' : Math.random() > 0.5 ? '#ff9a4d' : '#ffffff',
  }));

  const shoots = [];
  function spawnShoot() {
    shoots.push({ x: Math.random() * W, y: Math.random() * H * 0.5, len: Math.random() * 120 + 60, speed: Math.random() * 8 + 6, alpha: 1, angle: Math.PI / 5 + Math.random() * 0.3 });
  }
  setInterval(spawnShoot, 3200);

  const planets = [
    { x: 0.12, y: 0.18, r: 20, color: '#f5c842', glow: 'rgba(245,200,66,0.4)',  ring: true,  speed: 0.00008 },
    { x: 0.82, y: 0.72, r: 13, color: '#a78bfa', glow: 'rgba(124,58,237,0.35)', ring: false, speed: 0.00012 },
    { x: 0.65, y: 0.12, r: 9,  color: '#f0eaff', glow: 'rgba(240,234,255,0.2)', ring: false, speed: 0.00006 },
    { x: 0.90, y: 0.30, r: 7,  color: '#ff6b1a', glow: 'rgba(255,107,26,0.4)',  ring: false, speed: 0.00015 },
  ];

  const constellations = [
    { stars: [[0.08,0.25],[0.11,0.30],[0.09,0.36],[0.13,0.36],[0.15,0.30],[0.12,0.25],[0.10,0.20]] },
    { stars: [[0.75,0.15],[0.79,0.13],[0.83,0.14],[0.86,0.17],[0.84,0.21],[0.80,0.22],[0.76,0.20]] },
    { stars: [[0.50,0.08],[0.55,0.14],[0.45,0.14]] },
  ];

  const nebulae = [
    { x: 0.15, y: 0.6,  r: 280, c1: 'rgba(124,58,237,0.1)',  c2: 'transparent' },
    { x: 0.80, y: 0.35, r: 220, c1: 'rgba(255,107,26,0.08)', c2: 'transparent' },
    { x: 0.50, y: 0.85, r: 320, c1: 'rgba(0,80,200,0.07)',   c2: 'transparent' },
    { x: 0.30, y: 0.10, r: 200, c1: 'rgba(168,85,247,0.09)', c2: 'transparent' },
    { x: 0.70, y: 0.55, r: 180, c1: 'rgba(245,200,66,0.05)', c2: 'transparent' },
  ];

  function lighten(c) { return c === '#f5c842' ? '#ffe680' : c === '#a78bfa' ? '#c4b5fd' : c === '#ff6b1a' ? '#ff9a4d' : '#ffffff'; }
  function darken(c)  { return c === '#f5c842' ? '#9a7010' : c === '#a78bfa' ? '#5b21b6' : c === '#ff6b1a' ? '#9a2d00' : '#888888'; }

  function draw(now) {
    const t = now * 0.001;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(W*0.3, H*0.2, 0, W*0.5, H*0.5, Math.max(W,H));
    bg.addColorStop(0, '#1a0030'); bg.addColorStop(0.3, '#0d0020'); bg.addColorStop(0.6, '#04000f'); bg.addColorStop(1, '#000208');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    nebulae.forEach(n => {
      const g = ctx.createRadialGradient(n.x*W, n.y*H, 0, n.x*W, n.y*H, n.r);
      g.addColorStop(0, n.c1); g.addColorStop(1, n.c2);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x*W, n.y*H, n.r, 0, Math.PI*2); ctx.fill();
    });

    ctx.strokeStyle = 'rgba(201,168,76,0.12)'; ctx.lineWidth = 0.8;
    constellations.forEach(c => {
      ctx.beginPath();
      c.stars.forEach(([sx,sy],i) => i===0 ? ctx.moveTo(sx*W,sy*H) : ctx.lineTo(sx*W,sy*H));
      ctx.stroke();
      c.stars.forEach(([sx,sy]) => { ctx.fillStyle='rgba(201,168,76,0.35)'; ctx.beginPath(); ctx.arc(sx*W,sy*H,1.5,0,Math.PI*2); ctx.fill(); });
    });

    stars.forEach(s => {
      const tw = s.alpha + Math.sin(now * s.speed * 1000 + s.phase) * 0.3;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, tw));
      ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2); ctx.fill();
      if (s.r > 1.2) { ctx.globalAlpha = tw * 0.15; ctx.beginPath(); ctx.arc(s.x*W, s.y*H, s.r*3, 0, Math.PI*2); ctx.fill(); }
    });
    ctx.globalAlpha = 1;

    planets.forEach((p, i) => {
      const ox = Math.sin(t * p.speed * 1000 + i) * 18;
      const oy = Math.cos(t * p.speed * 800 + i) * 10;
      const px = p.x*W+ox, py = p.y*H+oy;
      const g = ctx.createRadialGradient(px,py,0,px,py,p.r*3.5);
      g.addColorStop(0,p.glow); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(px,py,p.r*3.5,0,Math.PI*2); ctx.fill();
      const b = ctx.createRadialGradient(px-p.r*0.3,py-p.r*0.3,p.r*0.1,px,py,p.r);
      b.addColorStop(0,lighten(p.color)); b.addColorStop(1,darken(p.color));
      ctx.fillStyle=b; ctx.beginPath(); ctx.arc(px,py,p.r,0,Math.PI*2); ctx.fill();
      if (p.ring) {
        ctx.save(); ctx.translate(px,py); ctx.scale(1,0.35);
        ctx.strokeStyle='rgba(201,168,76,0.45)'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.arc(0,0,p.r*1.9,0,Math.PI*2); ctx.stroke();
        ctx.strokeStyle='rgba(201,168,76,0.2)'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.arc(0,0,p.r*2.3,0,Math.PI*2); ctx.stroke();
        ctx.restore();
      }
    });

    for (let i = shoots.length-1; i >= 0; i--) {
      const s = shoots[i];
      const ex = s.x+Math.cos(s.angle)*s.len, ey = s.y+Math.sin(s.angle)*s.len;
      const g = ctx.createLinearGradient(s.x,s.y,ex,ey);
      g.addColorStop(0,`rgba(255,255,255,${s.alpha})`); g.addColorStop(1,'transparent');
      ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(ex,ey); ctx.stroke();
      s.x+=Math.cos(s.angle)*s.speed; s.y+=Math.sin(s.angle)*s.speed; s.alpha-=0.018;
      if (s.alpha<=0) shoots.splice(i,1);
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ============================================================
   ZODIAC POPUP
   ============================================================ */
const zodiacData = {
  Aries:       { sign:'♈', desc:'Bold, ambitious, and fiercely independent. Aries charges forward with unstoppable energy. Ruled by Mars, you are a natural-born leader destined for greatness.' },
  Taurus:      { sign:'♉', desc:'Grounded, sensual, and deeply loyal. Taurus is ruled by Venus and seeks beauty, stability, and lasting abundance in all areas of life.' },
  Gemini:      { sign:'♊', desc:'Curious, witty, and endlessly adaptable. Gemini is ruled by Mercury and thrives on communication, ideas, and the magic of human connection.' },
  Cancer:      { sign:'♋', desc:'Intuitive, nurturing, and deeply emotional. Cancer is ruled by the Moon and carries an extraordinary gift for empathy and creating safe spaces.' },
  Leo:         { sign:'♌', desc:'Radiant, creative, and magnetically charismatic. Leo is ruled by the Sun and is born to shine, lead, and inspire everyone around them.' },
  Virgo:       { sign:'♍', desc:'Analytical, devoted, and brilliantly precise. Virgo is ruled by Mercury and possesses an unmatched ability to see what others miss.' },
  Libra:       { sign:'♎', desc:'Charming, diplomatic, and endlessly fair-minded. Libra is ruled by Venus and seeks harmony, beauty, and meaningful partnerships.' },
  Scorpio:     { sign:'♏', desc:'Intense, magnetic, and profoundly transformative. Scorpio is ruled by Pluto and holds the power to reinvent themselves and the world around them.' },
  Sagittarius: { sign:'♐', desc:'Adventurous, philosophical, and wildly optimistic. Sagittarius is ruled by Jupiter and is forever chasing wisdom, freedom, and the horizon.' },
  Capricorn:   { sign:'♑', desc:'Disciplined, ambitious, and quietly powerful. Capricorn is ruled by Saturn and builds empires through patience, strategy, and sheer determination.' },
  Aquarius:    { sign:'♒', desc:'Visionary, humanitarian, and brilliantly original. Aquarius is ruled by Uranus and is here to revolutionize the world with radical ideas.' },
  Pisces:      { sign:'♓', desc:'Dreamy, compassionate, and deeply spiritual. Pisces is ruled by Neptune and possesses an otherworldly connection to the unseen realms of existence.' },
};

const overlay = document.createElement('div');
overlay.className = 'zpop-overlay';
document.body.appendChild(overlay);

document.querySelectorAll('.z-card').forEach(card => {
  card.addEventListener('click', () => {
    const sign = card.dataset.sign;
    const data = zodiacData[sign];
    document.getElementById('zpop-sign').textContent = data.sign;
    document.getElementById('zpop-name').textContent = sign;
    document.getElementById('zpop-desc').textContent = data.desc;
    document.getElementById('zodiac-popup').classList.add('active');
    overlay.classList.add('active');
  });
});

function closePopup() {
  document.getElementById('zodiac-popup')?.classList.remove('active');
  overlay.classList.remove('active');
}
document.getElementById('zpop-close')?.addEventListener('click', closePopup);
overlay.addEventListener('click', closePopup);

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = target >= 10000 ? '+' : target === 98 ? '%' : '+';
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.floor(eased * target);
    el.textContent = val.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ============================================================
   INTERSECTION OBSERVER — reveal + counters
   ============================================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ============================================================
   HAMBURGER
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => item.classList.toggle('open'));
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
function sendToWhatsApp(name, dob, service, message) {
  const phone = '18768451699';
  const text = `*New Consultation Request*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Date of Birth:* ${encodeURIComponent(dob || 'Not provided')}%0A*Service:* ${encodeURIComponent(service || 'Not selected')}%0A*Message:* ${encodeURIComponent(message || 'No message')}`;
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
  window.open(url, '_blank');
}

async function submitForm(formEl, successId) {
  const name    = formEl.querySelector('[name="name"]').value;
  const dob     = getDOB(formEl);
  const service = formEl.querySelector('[name="service"]').value;
  const message = formEl.querySelector('[name="message"]')?.value || '';

  const successEl = document.getElementById(successId);
  const btn = formEl.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  sendToWhatsApp(name, dob, service, message);

  setTimeout(() => {
    successEl.textContent = '★ Successfully sent! We will get back to you within 24 hours.';
    successEl.style.color = '';
    successEl.classList.remove('hidden');
    formEl.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }, 800);
}

function getDOB(formEl) {
  const day   = formEl.querySelector('[name="dob-day"]')?.value || '';
  const month = formEl.querySelector('[name="dob-month"]')?.value || '';
  const year  = formEl.querySelector('[name="dob-year"]')?.value || '';
  if (!day && !month && !year) return 'Not provided';
  return `${day} ${month} ${year}`.trim();
}

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(form, 'form-success');
  });
}

const ctaForm = document.getElementById('cta-form');
if (ctaForm) {
  ctaForm.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(ctaForm, 'cta-form-success');
  });
}

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.background = window.scrollY > 60 ? 'rgba(6,0,26,0.97)' : 'rgba(6,0,26,0.7)';
});