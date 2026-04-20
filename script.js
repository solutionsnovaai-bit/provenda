// ── CURSOR ──
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a,button,.faq-q').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '60px';
    ring.style.height = '60px';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '36px';
    ring.style.height = '36px';
  });
});

// ── CANVAS PARTÍCULAS ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.05;
    this.color = Math.random() > 0.85 ? '245,166,35' : '242,237,228';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animCanvas);
}
animCanvas();

// ── PARALLAX HERO ──
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const glow = document.querySelector('.hero-glow');
  if (glow) glow.style.transform = `translateX(-50%) translateY(${sy * 0.3}px)`;
});

// ── SCROLL REVEAL ──
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-inner,.fade-up').forEach(el => io.observe(el));

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const body = item.querySelector('.faq-body');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-body').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// ── STAGGER DELAYS ──
document.querySelectorAll('.dor-list li').forEach((li, i) => {
  li.style.transitionDelay = (i * 0.08) + 's';
  li.classList.add('fade-up');
  io.observe(li);
});
document.querySelectorAll('.entrega-list li').forEach((li, i) => {
  li.style.transitionDelay = (i * 0.06) + 's';
  li.classList.add('fade-up');
  io.observe(li);
});
document.querySelectorAll('.step').forEach((s, i) => {
  s.style.transitionDelay = (i * 0.1) + 's';
  s.classList.add('fade-up');
  io.observe(s);
});
document.querySelectorAll('.depo-card').forEach((c, i) => {
  c.style.transitionDelay = (i * 0.1) + 's';
  c.classList.add('fade-up');
  io.observe(c);
});
document.querySelectorAll('.audience-card').forEach((c, i) => {
  c.style.transitionDelay = (i * 0.08) + 's';
  c.classList.add('fade-up');
  io.observe(c);
});

// Trigger hero reveals imediatamente
setTimeout(() => {
  document.querySelectorAll('.hero .reveal-inner,.hero .fade-up').forEach(el => {
    el.classList.add('visible');
  });
}, 100);

// ── CHECKOUT MODAL ──
const overlay = document.getElementById('checkout-overlay');
const modalCloseBtn = document.getElementById('modal-close');

function openCheckout() {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Todos os CTAs abrem o modal
document.querySelectorAll('.btn-cta, .oferta-cta, [data-checkout]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openCheckout();
  });
});

modalCloseBtn.addEventListener('click', closeCheckout);

overlay.addEventListener('click', e => {
  if (e.target === overlay) closeCheckout();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCheckout();
});

// ── CONFETTI ──
const confettiCanvas = document.getElementById('confetti-canvas');
const cctx = confettiCanvas.getContext('2d');

const COLORS = ['#F5A623', '#25D366', '#F2EDE4', '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'];

let confettiPieces = [];
let confettiRunning = false;
let confettiAnimId = null;

class ConfettiPiece {
  constructor() {
    this.reset(true);
  }
  reset(fromTop = false) {
    this.x = Math.random() * confettiCanvas.width;
    this.y = fromTop ? -20 - Math.random() * 100 : Math.random() * confettiCanvas.height;
    this.w = Math.random() * 10 + 5;
    this.h = Math.random() * 5 + 3;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.2;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = Math.random() * 4 + 2;
    this.opacity = 1;
    this.fade = Math.random() * 0.01 + 0.005;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;
    if (this.y > confettiCanvas.height + 20) {
      this.opacity -= this.fade * 10;
    }
    if (this.opacity <= 0) this.dead = true;
  }
  draw() {
    cctx.save();
    cctx.globalAlpha = Math.max(0, this.opacity);
    cctx.translate(this.x, this.y);
    cctx.rotate(this.rotation);
    cctx.fillStyle = this.color;
    cctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    cctx.restore();
  }
}

function startConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCanvas.style.display = 'block';
  confettiPieces = [];
  for (let i = 0; i < 200; i++) {
    confettiPieces.push(new ConfettiPiece());
  }
  confettiRunning = true;
  animateConfetti();

  // Parar de adicionar e deixar cair tudo após 3s
  setTimeout(() => {
    confettiRunning = false;
  }, 3000);
}

function animateConfetti() {
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces = confettiPieces.filter(p => !p.dead);
  confettiPieces.forEach(p => { p.update(); p.draw(); });

  if (confettiRunning && confettiPieces.length < 300) {
    for (let i = 0; i < 3; i++) confettiPieces.push(new ConfettiPiece());
  }

  if (confettiPieces.length > 0) {
    confettiAnimId = requestAnimationFrame(animateConfetti);
  } else {
    confettiCanvas.style.display = 'none';
  }
}

// Botão de finalizar compra dispara confetti
document.getElementById('finalize-btn').addEventListener('click', e => {
  e.preventDefault();
  startConfetti();
  // Fechar modal após um delay pra ver o confetti
  setTimeout(closeCheckout, 600);
});
