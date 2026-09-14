/* Ke Iki Lūʻau — progressive enhancement only. Every page reads correctly
   with this file removed. */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  /* --- Header: transparent over a hero, solid once scrolled ------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    // Pages with a photo hero start transparent; interior pages start solid.
    var overHero = document.body.hasAttribute('data-hero');
    var setSolid = function () {
      var solid = !overHero || window.scrollY > 40;
      header.setAttribute('data-solid', solid ? 'true' : 'false');
    };
    setSolid();
    window.addEventListener('scroll', setSolid, { passive: true });
  }

  /* --- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('.nav__toggle');
  var list = document.querySelector('.nav__list');
  if (toggle && list) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      list.setAttribute('data-open', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    // Reset when the drawer breakpoint is left behind.
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* --- Scroll reveal ---------------------------------------------------- */
  var targets = document.querySelectorAll('[data-reveal]');
  if (targets.length && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Stagger siblings slightly so a row of cards arrives in sequence.
        var delay = Number(entry.target.getAttribute('data-reveal-delay') || 0);
        setTimeout(function () {
          entry.target.setAttribute('data-visible', 'true');
        }, delay);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.setAttribute('data-visible', 'true'); });
  }

  /* --- Countdown -------------------------------------------------------- */
  var clock = document.querySelector('[data-countdown]');
  if (clock) {
    var target = new Date(clock.getAttribute('data-countdown')).getTime();
    var fields = {
      days: clock.querySelector('[data-unit="days"]'),
      hours: clock.querySelector('[data-unit="hours"]'),
      minutes: clock.querySelector('[data-unit="minutes"]'),
      seconds: clock.querySelector('[data-unit="seconds"]')
    };
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };

    var tick = function () {
      var diff = target - Date.now();
      if (isNaN(target)) { clock.hidden = true; return; }
      if (diff <= 0) {
        clock.setAttribute('data-elapsed', 'true');
        diff = 0;
      }
      var s = Math.floor(diff / 1000);
      if (fields.days)    fields.days.textContent    = String(Math.floor(s / 86400));
      if (fields.hours)   fields.hours.textContent   = pad(Math.floor(s / 3600) % 24);
      if (fields.minutes) fields.minutes.textContent = pad(Math.floor(s / 60) % 60);
      if (fields.seconds) fields.seconds.textContent = pad(s % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* --- FAQ accordion ---------------------------------------------------- */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.setAttribute('data-open', String(!open));
    });
  });
})();
