/* ============================================================
   PROVENDA — main.js
   VFX canvas, GSAP + SplitType, Typewriter, Testo scroll,
   Checkout modal, Confetti
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     VFX CANVAS — grid de pontos âmbar reage ao cursor/touch
     ============================================================ */
  (function () {
    var cv = document.getElementById('vfx-canvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    var mob = window.matchMedia('(hover:none),(max-width:768px)').matches;
    var W, H, GRID, cols, rows;
    var pt = { x: -9999, y: -9999, vx: 0, vy: 0 };
    var lx = 0, ly = 0, sy = 0, ti = 0;
    var vfxRAF;

    function resize() {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      GRID = mob ? 75 : 58;
      cols = Math.ceil(W / GRID) + 2;
      rows = Math.ceil(H / GRID) + 2;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    if (!mob) {
      window.addEventListener('mousemove', function (e) {
        pt.vx = e.clientX - lx; pt.vy = e.clientY - ly;
        lx = pt.x = e.clientX; ly = pt.y = e.clientY;
      }, { passive: true });
    } else {
      window.addEventListener('touchmove', function (e) {
        var t = e.touches[0];
        pt.vx = t.clientX - lx; pt.vy = t.clientY - ly;
        lx = pt.x = t.clientX; ly = pt.y = t.clientY;
      }, { passive: true });
      window.addEventListener('touchend', function () {
        setTimeout(function () { pt.x = -9999; pt.y = -9999; }, 600);
      }, { passive: true });
    }
    window.addEventListener('scroll', function () { sy = window.scrollY; }, { passive: true });

    var lerp = function (a, b, n) { return a + (b - a) * n; };

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var spd = Math.sqrt(pt.vx * pt.vx + pt.vy * pt.vy);
      var scr = sy * 0.002;
      var INFL = mob ? 180 : 280;

      for (var xi = 0; xi < cols; xi++) {
        for (var yi = 0; yi < rows; yi++) {
          var bx = xi * GRID, by = yi * GRID;
          var dx = bx - pt.x, dy = by - pt.y;
          var d = Math.sqrt(dx * dx + dy * dy) || 1;
          var f = Math.max(0, 1 - d / INFL);
          var amp = 6 * f * (1 + spd * 0.03);
          var wv = Math.sin(xi * 0.4 + ti * 0.8 + scr) * Math.cos(yi * 0.4 + ti * 0.6 + scr) * 3;
          var px = bx + wv - (dx / d) * amp;
          var py = by + wv * 0.5 - (dy / d) * amp;
          var al = Math.min(1, lerp(0.035, 0.22, f) + 0.025 + Math.sin(ti + xi + yi) * 0.012);
          ctx.beginPath();
          ctx.arc(px, py, lerp(0.55, 1.9, f), 0, 6.283);
          ctx.fillStyle = 'rgba(245,166,35,' + al + ')';
          ctx.fill();
        }
      }

      if (!mob) {
        for (var xi2 = 0; xi2 < cols - 1; xi2++) {
          for (var yi2 = 0; yi2 < rows - 1; yi2++) {
            var bx2 = xi2 * GRID, by2 = yi2 * GRID;
            var dx2 = bx2 - pt.x, dy2 = by2 - pt.y;
            var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
            var f2 = Math.max(0, 1 - d2 / 240);
            if (f2 < 0.12) continue;
            var amp2 = 6 * f2 * (1 + spd * 0.03);
            var wv2 = Math.sin(xi2 * 0.4 + ti * 0.8 + scr) * Math.cos(yi2 * 0.4 + ti * 0.6 + scr) * 3;
            var px2 = bx2 + wv2 - (dx2 / d2) * amp2;
            var py2 = by2 + wv2 * 0.5 - (dy2 / d2) * amp2;

            var bx3 = (xi2 + 1) * GRID;
            var dx3 = bx3 - pt.x;
            var d3 = Math.sqrt(dx3 * dx3 + dy2 * dy2) || 1;
            var f3 = Math.max(0, 1 - d3 / 240);
            var amp3 = 6 * f3 * (1 + spd * 0.03);
            var wv3 = Math.sin((xi2 + 1) * 0.4 + ti * 0.8 + scr) * Math.cos(yi2 * 0.4 + ti * 0.6 + scr) * 3;
            var px3 = bx3 + wv3 - (dx3 / d3) * amp3;
            var py3 = by2 + wv3 * 0.5 - (dy2 / d3) * amp3;

            ctx.beginPath(); ctx.moveTo(px2, py2); ctx.lineTo(px3, py3);
            ctx.strokeStyle = 'rgba(245,166,35,' + (f2 * 0.12) + ')';
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }

      ti += mob ? 0.007 : 0.011;
      pt.vx *= 0.84; pt.vy *= 0.84;
      vfxRAF = requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ============================================================
     GSAP ANIMATIONS
     ============================================================ */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    var mob = window.matchMedia('(max-width:768px)').matches;
    var tl = gsap.timeline({ delay: 0.1 });

    // Hero headline — SplitType char-by-char
    if (typeof SplitType !== 'undefined') {
      var heroWords = document.querySelectorAll('.hero-headline .word');
      if (heroWords.length) {
        var sp = new SplitType('.hero-headline .word', { types: 'chars' });
        if (sp.chars && sp.chars.length) {
          gsap.set(sp.chars, { opacity: 0, y: mob ? 36 : 70, rotateX: -18 });
          tl.to(sp.chars, {
            opacity: 1, y: 0, rotateX: 0,
            stagger: 0.032, duration: 0.58, ease: 'power4.out',
            onComplete: function () {
              document.querySelectorAll('.glitch-text').forEach(function (el) {
                el.classList.add('active');
              });
            }
          }, 0);

          // Micro-animation loop no desktop
          if (!mob) {
            var gloop = function () {
              gsap.timeline()
                .to(sp.chars, { scaleY: 1.07, skewX: 1, duration: 0.05, stagger: { each: 0.01, from: 'random' }, ease: 'none' })
                .to(sp.chars, { scaleY: 1, skewX: 0, duration: 0.09, stagger: { each: 0.01, from: 'random' }, ease: 'elastic.out(1,.5)' })
                .to(sp.chars, { x: function () { return (Math.random() - 0.5) * 4; }, duration: 0.04, stagger: { each: 0.008, from: 'random' } })
                .to(sp.chars, { x: 0, duration: 0.14, ease: 'power2.out' });
              setTimeout(gloop, 2700 + Math.random() * 700);
            };
            setTimeout(gloop, 1800);
          }
        }
      }

      // Solution statement
      if (document.querySelector('.solution-stmt .big .inner')) {
        var ss = new SplitType('.solution-stmt .big .inner:first-child', { types: 'chars' });
        if (ss.chars) {
          gsap.from(ss.chars, {
            scrollTrigger: { trigger: '.solution-stmt', start: 'top 85%', once: true },
            opacity: 0, y: 40, rotateX: -14, stagger: 0.025, duration: 0.5, ease: 'power4.out'
          });
        }
      }

      // Final CTA
      if (document.querySelector('.final-cta h2 .inner')) {
        var fc = new SplitType('.final-cta h2 .inner', { types: 'chars' });
        if (fc.chars) {
          gsap.from(fc.chars, {
            scrollTrigger: { trigger: '.final-cta', start: 'top 85%', once: true },
            opacity: 0, y: 50, rotateX: -18, stagger: 0.03, duration: 0.55, ease: 'power4.out'
          });
        }
      }

      // Pain statement
      if (document.querySelector('.pain-statement .amber')) {
        var ps = new SplitType('.pain-statement .amber', { types: 'chars' });
        if (ps.chars) {
          gsap.from(ps.chars, {
            scrollTrigger: { trigger: '.pain-statement', start: 'top 90%', once: true },
            opacity: 0, y: 30, stagger: 0.08, duration: 0.5, ease: 'power3.out'
          });
        }
      }
    }

    // Hero supporting elements
    tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.6, ease: 'power3.out' }, 0.08)
      .from('.urgency-bar', { opacity: 0, y: 14, duration: 0.55, ease: 'power3.out' }, 0.22)
      .from('.hero-sub', { opacity: 0, y: 18, duration: 0.65, ease: 'power3.out' }, 0.7)
      .from('.hero-cta-row', { opacity: 0, y: 14, duration: 0.65, ease: 'power3.out' }, 0.88);

    // Scroll-triggered blocks
    document.querySelectorAll('.features-grid,.apps-grid,.guarantee-row,.testo-track,.final-cta-sub,.pain-eyebrow,.pain-grid,.flow-strip').forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        opacity: 0, y: 28, duration: 0.8, delay: (i % 3) * 0.06, ease: 'power3.out'
      });
    });

    // Feature cards stagger
    gsap.from('.feature-card', {
      scrollTrigger: { trigger: '.features-grid', start: 'top 88%', once: true },
      opacity: 0, y: 26, stagger: 0.09, duration: 0.6, ease: 'power3.out'
    });

    // Pain cards stagger
    gsap.from('.pain-card', {
      scrollTrigger: { trigger: '.pain-grid', start: 'top 88%', once: true },
      opacity: 0, y: 28, stagger: 0.1, duration: 0.65, ease: 'power3.out'
    });

    // Entregaveis stagger
    gsap.from('.entregavel-item', {
      scrollTrigger: { trigger: '.entregavel-item', start: 'top 90%', once: true },
      opacity: 0, x: -20, stagger: 0.1, duration: 0.6, ease: 'power3.out'
    });

    // Plan card glow pulse
    gsap.to('.plan-card', {
      boxShadow: '0 0 60px rgba(245,166,35,.18), 0 0 120px rgba(245,166,35,.07)',
      duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }

  /* ============================================================
     STEPS REVEAL (IntersectionObserver fallback se GSAP n/a)
     ============================================================ */
  document.querySelectorAll('.step-row').forEach(function (el, i) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          setTimeout(function () { e.target.classList.add('revealed'); }, i * 140);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    io.observe(el);
  });

  /* ============================================================
     SCROLL REVEAL genérico (.rv)
     ============================================================ */
  var rvIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.transition = 'opacity .65s ease, transform .65s ease';
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        rvIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.rv').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    rvIO.observe(el);
  });

  /* ============================================================
     TYPEWRITER
     ============================================================ */
  (function () {
    var el = document.getElementById('typewriter-word');
    if (!el) return;
    var words = ['DATILOGRAR.', 'DIGITAR.', 'COPIAR E COLAR.', 'REPETIR.'];
    var wi = 0, ci = 0, del = false;
    el.innerHTML = '<span class="tw-cursor">▌</span>';
    function tw() {
      var w = words[wi];
      if (!del) {
        ci++;
        el.textContent = w.slice(0, ci);
        if (ci === w.length) { del = true; setTimeout(tw, 1800); return; }
      } else {
        ci--;
        el.textContent = w.slice(0, ci);
        if (ci === 0) { del = false; wi = (wi + 1) % words.length; setTimeout(tw, 300); return; }
      }
      setTimeout(tw, del ? 45 : 90);
    }
    setTimeout(tw, 800);
  })();

  /* ============================================================
     TESTIMONIAL AUTO SCROLL
     ============================================================ */
  (function () {
    var t = document.getElementById('testoTrack');
    if (!t) return;
    var pos = 0, dir = 1, paused = false;
    t.addEventListener('mouseenter', function () { paused = true; });
    t.addEventListener('mouseleave', function () { paused = false; });
    t.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    t.addEventListener('touchend', function () { setTimeout(function () { paused = false; }, 2500); });
    (function go() {
      if (!paused) {
        pos += 0.5 * dir;
        var mx = t.scrollWidth - t.parentElement.clientWidth;
        if (pos >= mx) dir = -1;
        if (pos <= 0) dir = 1;
        t.style.transform = 'translateX(-' + pos + 'px)';
      }
      requestAnimationFrame(go);
    })();
  })();

  /* ============================================================
     FAQ
     ============================================================ */
  document.querySelectorAll('.faq-item').forEach(function (el) {
    el.addEventListener('click', function () {
      var was = el.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
      if (!was) el.classList.add('open');
    });
  });

  /* ============================================================
     SMOOTH SCROLL
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var tgt = document.querySelector(a.getAttribute('href'));
      if (!tgt) return;
      e.preventDefault();
      window.scrollTo({ top: tgt.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
    });
  });

  /* ============================================================
     CARD NUMBER FORMAT
     ============================================================ */
  var cardNumber = document.getElementById('cardNumber');
  if (cardNumber) {
    cardNumber.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').substring(0, 16);
      this.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
  }
  var cardExpiry = document.getElementById('cardExpiry');
  if (cardExpiry) {
    cardExpiry.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').substring(0, 4);
      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
      this.value = v;
    });
  }
  var cardCpf = document.getElementById('cardCpf');
  if (cardCpf) {
    cardCpf.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').substring(0, 11);
      if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
      else if (v.length > 3) v = v.replace(/(\d{3})(\d+)/, '$1.$2');
      this.value = v;
    });
  }

  /* ============================================================
     CHECKOUT
     ============================================================ */
  var currentPlan = 'provenda';
  var selInst = 1;
  var plans = {
    provenda: {
      label: 'ACESSO PROVENDA — 12 MESES',
      name: 'PROVENDA',
      price: 'R$ 47',
      value: 47,
      display: 'R$ 47,00'
    }
  };

  function buildInstallments(val) {
    var grid = document.getElementById('installmentsGrid');
    if (!grid) return;
    var h = '';
    for (var x = 1; x <= 12; x++) {
      var sel = x === selInst ? ' selected' : '';
      h += '<button class="inst-btn' + sel + '" data-inst="' + x + '"><span class="inst-x">' + x + 'x</span><span class="inst-val">sem juros</span></button>';
    }
    grid.innerHTML = h;
    grid.querySelectorAll('.inst-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selInst = parseInt(btn.dataset.inst, 10);
        buildInstallments(plans[currentPlan].value);
        updateSubmit();
      });
    });
  }

  function updateSubmit() {
    var btn = document.getElementById('coSubmitBtn');
    if (!btn) return;
    var p = plans[currentPlan];
    var x = selInst;
    var m = (p.value / x).toFixed(2).replace('.', ',');
    btn.textContent = x === 1 ? ('🔒 PAGAR ' + p.display) : ('🔒 PAGAR ' + x + 'x DE R$ ' + m + ' SEM JUROS');
  }

  window.openCheckout = function (key) {
    currentPlan = key || 'provenda';
    selInst = 1;
    var p = plans[currentPlan];
    var el;
    if ((el = document.getElementById('coPlanLabel'))) el.textContent = p.label;
    if ((el = document.getElementById('coPlanName'))) el.textContent = p.name;
    if ((el = document.getElementById('coPlanPrice'))) el.textContent = p.price;
    if ((el = document.getElementById('pixAmountText'))) el.textContent = p.display;
    if ((el = document.getElementById('pixStepValor'))) el.textContent = p.display;
    buildInstallments(p.value);
    switchTab('pix');
    updateSubmit();

    var overlay = document.getElementById('checkoutOverlay');
    var modal = document.getElementById('checkoutModal');
    if (overlay) overlay.classList.add('active');
    if (modal) {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(modal,
          { y: 40, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.2)' }
        );
      } else {
        modal.style.transform = 'translateY(0) scale(1)';
        modal.style.opacity = '1';
      }
    }
    document.body.style.overflow = 'hidden';
    // Resetar success
    var coBody = document.getElementById('coBody');
    if (coBody && !coBody.querySelector('.pay-tabs')) {
      coBody.innerHTML = buildCoBody();
      initCoBody();
    }
  };

  window.closeCheckout = function () {
    var overlay = document.getElementById('checkoutOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    stopConfetti();
  };

  function buildCoBody() {
    return document.getElementById('coBodyTemplate') ? document.getElementById('coBodyTemplate').innerHTML : '';
  }

  var overlay = document.getElementById('checkoutOverlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) window.closeCheckout();
    });
  }
  var coCloseBtn = document.getElementById('coCloseBtn');
  if (coCloseBtn) coCloseBtn.addEventListener('click', window.closeCheckout);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeCheckout();
  });

  window.switchTab = function (tab) {
    var pp = document.getElementById('pixPanel');
    var cp = document.getElementById('cardPanel');
    var tp = document.getElementById('tabPix');
    var tc = document.getElementById('tabCard');
    if (!pp || !cp || !tp || !tc) return;
    if (tab === 'pix') {
      pp.style.display = ''; cp.style.display = 'none';
      tp.classList.add('active'); tc.classList.remove('active');
    } else {
      pp.style.display = 'none'; cp.style.display = '';
      tc.classList.add('active'); tp.classList.remove('active');
    }
  };

  // PIX copy
  function doCopy() {
    var keyEl = document.getElementById('pixKey');
    var pixCopyBtn = document.getElementById('pixCopyBtn');
    if (!keyEl || !pixCopyBtn) return;
    var key = keyEl.textContent.trim();
    var ok = function () {
      pixCopyBtn.textContent = '✓ COPIADO';
      pixCopyBtn.classList.add('copied');
      setTimeout(function () {
        pixCopyBtn.textContent = 'COPIAR';
        pixCopyBtn.classList.remove('copied');
      }, 2200);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(key).then(ok).catch(function () { fb(key, ok); });
    } else { fb(key, ok); }
  }
  function fb(t, cb) {
    var ta = document.createElement('textarea');
    ta.value = t; ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); } catch (e) { }
    document.body.removeChild(ta); cb();
  }

  function initCoBody() {
    var pixKeyBox = document.getElementById('pixKeyBox');
    var pixCopyBtn = document.getElementById('pixCopyBtn');
    if (pixKeyBox) pixKeyBox.addEventListener('click', doCopy);
    if (pixCopyBtn) pixCopyBtn.addEventListener('click', function (e) { e.stopPropagation(); doCopy(); });

    var pixConfirm = document.getElementById('pixConfirmBtn');
    if (pixConfirm) pixConfirm.addEventListener('click', window.showSuccess);

    var coSubmit = document.getElementById('coSubmitBtn');
    if (coSubmit) coSubmit.addEventListener('click', window.submitCard);

    var tabPix = document.getElementById('tabPix');
    var tabCard = document.getElementById('tabCard');
    if (tabPix) tabPix.addEventListener('click', function () { switchTab('pix'); });
    if (tabCard) tabCard.addEventListener('click', function () { switchTab('card'); });

    // re-attach formatters
    var cn = document.getElementById('cardNumber');
    if (cn) cn.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').substring(0, 16);
      this.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
    var ce = document.getElementById('cardExpiry');
    if (ce) ce.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').substring(0, 4);
      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
      this.value = v;
    });
    var cc = document.getElementById('cardCpf');
    if (cc) cc.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').substring(0, 11);
      if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
      else if (v.length > 3) v = v.replace(/(\d{3})(\d+)/, '$1.$2');
      this.value = v;
    });
    buildInstallments(plans[currentPlan].value);
    updateSubmit();
  }
  initCoBody();

  window.submitCard = function () {
    var cardName = document.getElementById('cardName');
    var cardNumber2 = document.getElementById('cardNumber');
    var cardExpiry2 = document.getElementById('cardExpiry');
    var cardCvv = document.getElementById('cardCvv');
    var cardCpf2 = document.getElementById('cardCpf');
    var fields = [
      { el: cardName, ok: function () { return cardName && cardName.value.trim().length > 1; } },
      { el: cardNumber2, ok: function () { return cardNumber2 && cardNumber2.value.replace(/\s/g, '').length === 16; } },
      { el: cardExpiry2, ok: function () { return cardExpiry2 && cardExpiry2.value.length === 5; } },
      { el: cardCvv, ok: function () { return cardCvv && cardCvv.value.length >= 3; } },
      { el: cardCpf2, ok: function () { return cardCpf2 && cardCpf2.value.replace(/\D/g, '').length === 11; } }
    ];
    var valid = true;
    fields.forEach(function (f) {
      if (!f.el) return;
      f.el.classList.remove('error');
      if (!f.ok()) { f.el.classList.add('error'); valid = false; }
    });
    if (!valid) {
      var first = document.querySelector('.co-input.error');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    var btn = document.getElementById('coSubmitBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="pdots"><i></i><i></i><i></i></span> PROCESSANDO';
    }
    setTimeout(window.showSuccess, 2200);
  };

  window.showSuccess = function () {
    var p = plans[currentPlan];
    var modal = document.getElementById('checkoutModal');
    var body = document.getElementById('coBody');
    if (!modal || !body) return;
    modal.scrollTop = 0;
    body.style.transition = 'opacity .28s,transform .28s';
    body.style.opacity = '0'; body.style.transform = 'translateY(10px)';
    setTimeout(function () {
      body.innerHTML = '<div class="co-success">' +
        '<div class="co-check-wrap"><div class="co-ring"></div>' +
        '<svg viewBox="0 0 40 40"><path d="M8 21 L17 30 L32 13"/></svg></div>' +
        '<h3>PAGAMENTO <em>CONFIRMADO!</em></h3>' +
        '<div class="co-success-plan">' + p.label + '</div>' +
        '<p class="co-success-body">Seu acesso ao <strong>' + p.name + '</strong> foi processado com sucesso.<br><br>' +
        'Verifique seu e-mail — o acesso chega em instantes.</p>' +
        '<div class="co-success-badge">⚡ &nbsp;ACESSO LIBERADO EM INSTANTES</div>' +
        '<button class="co-success-close" onclick="window.closeCheckout()">FECHAR ESTA JANELA</button>' +
        '</div>';
      body.style.opacity = '1'; body.style.transform = 'translateY(0)';
      startConfetti();
    }, 290);
  };

  /* ============================================================
     CONFETTI
     ============================================================ */
  var cRAF = null;
  var CONFETTI_COLS = ['#F5A623', '#ffc246', '#FFD700', '#fff', '#4ade80', '#00F5FF', '#FF2D55', '#f97316'];

  function startConfetti() {
    var cv = document.getElementById('confetti-canvas');
    if (!cv) return;
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    cv.classList.add('active');
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    var pieces = [];
    for (var i = 0; i < 160; i++) {
      pieces.push({
        x: Math.random() * cv.width, y: -10 - Math.random() * 220,
        w: 5 + Math.random() * 9, h: 3 + Math.random() * 5,
        r: Math.random() * Math.PI * 2, rv: (Math.random() - 0.5) * 0.17,
        vx: (Math.random() - 0.5) * 3.8, vy: 2.8 + Math.random() * 3.8,
        c: CONFETTI_COLS[Math.floor(Math.random() * CONFETTI_COLS.length)],
        op: 1
      });
    }
    var frame = 0;
    var tick = function () {
      ctx.clearRect(0, 0, cv.width, cv.height);
      var alive = false;
      pieces.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.r += p.rv; p.vy += 0.055;
        if (frame > 110) p.op = Math.max(0, p.op - 0.013);
        if (p.y < cv.height + 20 && p.op > 0) alive = true;
        ctx.save(); ctx.globalAlpha = p.op;
        ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (alive && frame < 340) { cRAF = requestAnimationFrame(tick); }
      else stopConfetti();
    };
    tick();
  }

  function stopConfetti() {
    var cv = document.getElementById('confetti-canvas');
    if (cv) cv.classList.remove('active');
    if (cRAF) { cancelAnimationFrame(cRAF); cRAF = null; }
  }

});
