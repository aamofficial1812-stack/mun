/* ============================================================
   AIKTC MODEL UNITED NATIONS — script.js
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     0. Data — source of truth. Edit here, not in the markup.
  --------------------------------------------------------- */
  var EVENT_TARGET_ISO = '2026-09-18T21:00:00+05:30'; // 18 Sep 2026, 9:00 PM IST

  var PORTFOLIOS = [
    "People\u2019s Democratic Republic of Algeria",
    "Republic of Angola",
    "Commonwealth of Australia",
    "Plurinational State of Bolivia",
    "Republic of Botswana",
    "Federative Republic of Brazil",
    "Canada",
    "Republic of Chile",
    "People\u2019s Republic of China",
    "Republic of Costa Rica",
    "Republic of Cuba",
    "Democratic People\u2019s Republic of Korea",
    "Kingdom of Denmark",
    "Republic of Finland",
    "Federal Republic of Germany",
    "State of Israel",
    "Italian Republic",
    "Japan",
    "Lao People\u2019s Democratic Republic",
    "Republic of Mauritius",
    "United Mexican States",
    "Republic of Mozambique",
    "Federal Democratic Republic of Nepal",
    "New Zealand",
    "Republic of Nicaragua",
    "Kingdom of Norway",
    "State of Qatar",
    "Republic of Singapore",
    "Republic of South Africa",
    "Republic of Korea",
    "Kingdom of Spain",
    "Democratic Socialist Republic of Sri Lanka",
    "Kingdom of Sweden",
    "Swiss Confederation",
    "United Republic of Tanzania",
    "United Arab Emirates",
    "United Kingdom of Great Britain and Northern Ireland",
    "United States of America",
    "Oriental Republic of Uruguay",
    "Bolivarian Republic of Venezuela",
    "Socialist Republic of Vietnam",
    "Kingdom of Saudi Arabia"
  ];

  /* ---------------------------------------------------------
     1. Navbar scroll state + mobile drawer
  --------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var drawer = document.getElementById('mobile-drawer');

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function toggleDrawer(open) {
    var isOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('drawer-open', isOpen);
  }
  hamburger.addEventListener('click', function () { toggleDrawer(); });
  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleDrawer(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') toggleDrawer(false);
  });

  /* ---------------------------------------------------------
     2. Countdown (navbar, drawer, hero event panel)
  --------------------------------------------------------- */
  var targetDate = new Date(EVENT_TARGET_ISO);

  var els = {
    ncD: document.getElementById('nc-d'), ncH: document.getElementById('nc-h'),
    ncM: document.getElementById('nc-m'), ncS: document.getElementById('nc-s'),
    mcD: document.getElementById('mc-d'), mcH: document.getElementById('mc-h'),
    mcM: document.getElementById('mc-m'), mcS: document.getElementById('mc-s'),
    mcUnits: document.getElementById('main-countdown-units'),
    mcLive: document.getElementById('mc-live'),
    drawerCd: document.getElementById('drawer-countdown')
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickCountdown() {
    var now = new Date();
    var diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      if (els.ncD) { els.ncD.textContent = '00'; els.ncH.textContent = '00'; els.ncM.textContent = '00'; els.ncS.textContent = '00'; }
      if (els.mcUnits) els.mcUnits.hidden = true;
      if (els.mcLive) els.mcLive.hidden = false;
      if (els.drawerCd) els.drawerCd.textContent = 'MUN IS LIVE';
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    var d = pad(days), h = pad(hours), m = pad(minutes), s = pad(seconds);

    if (els.ncD) { els.ncD.textContent = d; els.ncH.textContent = h; els.ncM.textContent = m; els.ncS.textContent = s; }
    if (els.mcD) { els.mcD.textContent = d; els.mcH.textContent = h; els.mcM.textContent = m; els.mcS.textContent = s; }
    if (els.drawerCd) els.drawerCd.textContent = d + 'D ' + h + 'H ' + m + 'M ' + s + 'S \u00B7 18 SEP 2026';
  }

  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------------------------------------------------------
     3. Scroll reveals (IntersectionObserver)
  --------------------------------------------------------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');

  if (reduceMotion) {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------------------------------------------------
     4. Portfolio matrix — render + live search
  --------------------------------------------------------- */
  var portfolioGrid = document.getElementById('portfolio-grid');
  var portfolioSearch = document.getElementById('portfolio-search-input');
  var portfolioCountNum = document.getElementById('portfolio-count-num');

  function renderPortfolio(filterText) {
    var query = (filterText || '').trim().toLowerCase();
    var matches = PORTFOLIOS.filter(function (name) {
      return name.toLowerCase().indexOf(query) !== -1;
    });

    portfolioGrid.innerHTML = '';

    if (matches.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'portfolio-empty';
      empty.textContent = 'No portfolio matches your search.';
      portfolioGrid.appendChild(empty);
    } else {
      matches.forEach(function (name) {
        var isSaudi = name.indexOf('Saudi Arabia') !== -1;
        var cell = document.createElement('div');
        cell.className = 'portfolio-cell' + (isSaudi ? ' saudi' : '');

        var nameEl = document.createElement('span');
        nameEl.className = 'pc-name';
        nameEl.textContent = name;

        var statusEl = document.createElement('span');
        statusEl.className = 'pc-status';
        statusEl.textContent = 'Not Yet Allocated';

        cell.appendChild(nameEl);
        cell.appendChild(statusEl);
        portfolioGrid.appendChild(cell);
      });
    }

    if (portfolioCountNum) portfolioCountNum.textContent = String(matches.length);
  }

  renderPortfolio('');
  if (portfolioSearch) {
    portfolioSearch.addEventListener('input', function (e) { renderPortfolio(e.target.value); });
  }

  /* ---------------------------------------------------------
     5. Register interest — lightweight local confirmation
     (No backend/registration link has been provided; this simply
     acknowledges intent without fabricating a submission endpoint.)
  --------------------------------------------------------- */
  var registerBtn = document.getElementById('register-interest-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', function () {
      registerBtn.textContent = 'Noted \u2014 We\u2019ll Be in Touch';
      registerBtn.disabled = true;
      registerBtn.classList.add('btn-disabled');
    });
  }

})();