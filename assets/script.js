// Creative Camel Studio — shared behavior
(function () {
  // Mobile menu — tap-triggered (see styles.css: --ease-spring, no bounce)
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    var closeMenu = function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('click', function (e) {
      if (links.classList.contains('open') && !links.contains(e.target) && e.target !== toggle) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // FAQ accordion — CSS grid-rows does the animating, JS only flips the state
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Stat card count-up — animates once, when the card scrolls into view
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    var duration = 1100;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = target * easeOutExpo(progress);
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count-to]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          countIo.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countIo.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count-to') + (el.getAttribute('data-suffix') || '');
    });
  }

  // Arc text entrance — WORKSHOPS/GROWTH/DESIGN slide along their curve into place on load
  var arcLabels = document.querySelectorAll('.card-swoosh textPath');
  if (arcLabels.length && !reduceMotion) {
    var arcRestOffset = 8, arcStartOffset = 150, arcDuration = 1000;
    arcLabels.forEach(function (tp, i) {
      var text = tp.closest('text');
      tp.setAttribute('startOffset', arcStartOffset);
      if (text) text.style.opacity = 0;
      setTimeout(function () {
        var start = null;
        function tick(ts) {
          if (start === null) start = ts;
          var progress = Math.min((ts - start) / arcDuration, 1);
          var eased = easeOutExpo(progress);
          tp.setAttribute('startOffset', arcStartOffset + (arcRestOffset - arcStartOffset) * eased);
          if (text) text.style.opacity = eased;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }, i * 150);
    });
  } else {
    arcLabels.forEach(function (tp) { tp.setAttribute('startOffset', 8); });
  }

  // Hero mark heartbeat — devices without hover get a one-time "greeting" pulse instead
  var markWrap = document.querySelector('.mark-wrap');
  if (markWrap && !reduceMotion && window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
    if ('IntersectionObserver' in window) {
      var markIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            setTimeout(function () { markWrap.classList.add('beat'); }, 400);
            markIo.unobserve(en.target);
          }
        });
      }, { threshold: 0.6 });
      markIo.observe(markWrap);
    }
  }

  // Scroll reveal
  var revealed = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add('in'); });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Heart burst — small celebration, reserved for moments that actually matter
  function burstHearts(x, y) {
    if (reduceMotion) return;
    var count = 10;
    for (var i = 0; i < count; i++) {
      var span = document.createElement('span');
      span.className = 'burst-heart';
      span.textContent = '♥';
      var angle = (Math.PI * 2 * i) / count + (Math.random() * 0.6 - 0.3);
      var dist = 70 + Math.random() * 90;
      span.style.left = x + 'px';
      span.style.top = y + 'px';
      span.style.fontSize = (14 + Math.random() * 12) + 'px';
      span.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px');
      span.style.setProperty('--ty', (Math.sin(angle) * dist - 40) + 'px');
      span.style.setProperty('--r', (Math.random() * 60 - 30) + 'deg');
      document.body.appendChild(span);
      span.addEventListener('animationend', function () { this.remove(); });
    }
  }

  // Fires on the contact form's actual submit — the one moment worth celebrating
  var contactForm = document.getElementById('form');
  if (contactForm) {
    contactForm.addEventListener('submit', function () {
      var btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        var r = btn.getBoundingClientRect();
        burstHearts(r.left + r.width / 2, r.top + r.height / 2);
      }
    });
  }

  // Toast for the easter egg below
  function showToast(msg) {
    var existing = document.querySelector('.egg-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'egg-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('show'); });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 4200);
  }

  // Hidden easter egg — five quick clicks on the footer mark
  var footLogo = document.querySelector('.foot-brand img');
  if (footLogo) {
    footLogo.style.cursor = 'pointer';
    var eggClicks = 0, eggTimer = null;
    footLogo.addEventListener('click', function () {
      eggClicks++;
      clearTimeout(eggTimer);
      eggTimer = setTimeout(function () { eggClicks = 0; }, 2500);
      if (eggClicks === 5) {
        eggClicks = 0;
        var r = footLogo.getBoundingClientRect();
        burstHearts(r.left + r.width / 2, r.top + r.height / 2);
        showToast("You found it! 🐫 Five clicks in — that's exactly the kind of attention to detail we love in a project brief too.");
      }
    });
  }

  // Looping preview videos stay still for users who prefer reduced motion
  if (reduceMotion) {
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      v.removeAttribute('autoplay');
      v.pause();
    });
  }

  // Cursor companion — the native cursor stays; a little dot trails behind it
  // with a springy catch-up, and blooms into a ring over anything clickable
  if (!reduceMotion && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot cursor-hidden';
    document.body.appendChild(cursorDot);

    var mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;
    var cursorShown = false, trailRunning = false;

    function trailTick() {
      dotX += (mouseX - dotX) * 0.16;
      dotY += (mouseY - dotY) * 0.16;
      cursorDot.style.transform = 'translate(' + dotX + 'px,' + dotY + 'px) translate(-50%,-50%)';
      requestAnimationFrame(trailTick);
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorShown) {
        if (!trailRunning) {
          dotX = mouseX; dotY = mouseY;
          trailRunning = true;
          requestAnimationFrame(trailTick);
        }
        cursorDot.classList.remove('cursor-hidden');
        cursorShown = true;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      cursorDot.classList.add('cursor-hidden');
      cursorShown = false;
    });

    var cursorHoverSelector = 'a, button, input, textarea, select, .faq-q, .nav-toggle, [role="button"]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(cursorHoverSelector)) cursorDot.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(cursorHoverSelector)) cursorDot.classList.remove('cursor-hover');
    });
  }
})();
