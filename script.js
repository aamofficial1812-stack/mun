/* ============================================================
   AIKTCMUN — script.js
   Shared across index.html, mun.html, aippm.html.
   All DOM lookups are null-checked so missing elements on any
   given page never throw console errors.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     0. Data — source of truth. Edit here, not in the markup.
  --------------------------------------------------------- */
  var EVENT_TARGET_ISO = '2026-09-18T21:00:00+05:30'; // 18 Sep 2026, 9:00 PM IST

  /* UNHRC — country portfolios. Kingdom of Saudi Arabia is preserved
     and featured, per the confirmed source list. Do not remove it. */
  var UNHRC_PORTFOLIOS = [
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

  /* AIPPM — delegate (party representative) portfolios, as supplied. */
  var AIPPM_PORTFOLIOS = [
    { name: "Abhijeet Dipke", party: "Cockroach Janta Party" },
    { name: "Akhilesh Yadav", party: "Samajwadi Party" },
    { name: "Amit Shah", party: "Bharatiya Janata Party" },
    { name: "Anurag Singh Thakur", party: "Bharatiya Janata Party" },
    { name: "Arvind Kejriwal", party: "Aam Aadmi Party" },
    { name: "Asaduddin Owaisi", party: "All India Majlis-e-Ittehadul Muslimeen" },
    { name: "Ashwini Vaishnaw", party: "Bharatiya Janata Party" },
    { name: "Atishi Marlena", party: "Aam Aadmi Party" },
    { name: "Chandrashekhar Azad", party: "Azad Samaj Party\u2013Kanshi Ram" },
    { name: "Chirag Paswan", party: "Lok Janshakti Party\u2013Ram Vilas" },
    { name: "D. Raja", party: "Communist Party of India" },
    { name: "Derek O\u2019Brien", party: "All India Trinamool Congress" },
    { name: "Dharmendra Pradhan", party: "Bharatiya Janata Party" },
    { name: "Digvijaya Singh", party: "Indian National Congress" },
    { name: "Gaurav Gogoi", party: "Indian National Congress" },
    { name: "Hardeep Singh Puri", party: "Bharatiya Janata Party" },
    { name: "Hemant Soren", party: "Jharkhand Mukti Morcha" },
    { name: "Jairam Ramesh", party: "Indian National Congress" },
    { name: "Jyotiraditya M. Scindia", party: "Bharatiya Janata Party" },
    { name: "Kanimozhi Karunanidhi", party: "Dravida Munnetra Kazhagam" },
    { name: "Kapil Sibal", party: "Independent" },
    { name: "K. C. Venugopal", party: "Indian National Congress" },
    { name: "Mahua Moitra", party: "All India Trinamool Congress" },
    { name: "Mallikarjun Kharge", party: "Indian National Congress" },
    { name: "Manish Tewari", party: "Indian National Congress" },
    { name: "Manoj Kumar Jha", party: "Rashtriya Janata Dal" },
    { name: "Mamata Banerjee", party: "All India Trinamool Congress" },
    { name: "Mehbooba Mufti", party: "Jammu and Kashmir Peoples Democratic Party" },
    { name: "Narendra Modi", party: "Bharatiya Janata Party" },
    { name: "Nirmala Sitharaman", party: "Bharatiya Janata Party" },
    { name: "Pinarayi Vijayan", party: "Communist Party of India (Marxist)" },
    { name: "Priyanka Gandhi Vadra", party: "Indian National Congress" },
    { name: "Rahul Gandhi", party: "Indian National Congress" },
    { name: "Raghav Chadha", party: "Aam Aadmi Party" },
    { name: "Sachin Pilot", party: "Indian National Congress" },
    { name: "Sanjay Raut", party: "Shiv Sena (Uddhav Balasaheb Thackeray)" },
    { name: "Saurav Das", party: "Cockroach Janta Party" },
    { name: "Shashi Tharoor", party: "Indian National Congress" },
    { name: "Smriti Irani", party: "Bharatiya Janata Party" },
    { name: "Sudhanshu Trivedi", party: "Bharatiya Janata Party" },
    { name: "Supriya Sule", party: "Nationalist Congress Party\u2013Sharadchandra Pawar" }
  ];

  /* ---------------------------------------------------------
     1. Navbar scroll state + mobile drawer
  --------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var drawer = document.getElementById('mobile-drawer');

  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function toggleDrawer(open) {
    if (!drawer || !hamburger) return;
    var isOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('drawer-open', isOpen);
  }
  if (hamburger) hamburger.addEventListener('click', function () { toggleDrawer(); });
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { toggleDrawer(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') toggleDrawer(false);
  });

  /* ---------------------------------------------------------
     2. Countdown (navbar, drawer, hero/event panel — any page)
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
    if (els.drawerCd) els.drawerCd.textContent = d + 'D ' + h + 'H ' + m + 'M ' + s + 'S \u00B7 18\u201319 SEP 2026';
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
     4a. UNHRC portfolio grid — render + live search (mun.html)
  --------------------------------------------------------- */
  var portfolioGrid = document.getElementById('portfolio-grid');
  var portfolioSearch = document.getElementById('portfolio-search-input');
  var portfolioCountNum = document.getElementById('portfolio-count-num');

  /* Single source of truth stays UNHRC_PORTFOLIOS above; the list shown
     to the user is always derived from a fresh alphabetical sort so the
     order is stable, predictable, and never relies on manual HTML order.
     Every portfolio (including Kingdom of Saudi Arabia) renders through
     the same, identical card design — no special/executive treatment. */
  var UNHRC_PORTFOLIOS_SORTED = UNHRC_PORTFOLIOS.slice().sort(function (a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  });

  function renderUnhrcPortfolio(filterText) {
    if (!portfolioGrid) return;
    var query = (filterText || '').trim().toLowerCase();
    var matches = UNHRC_PORTFOLIOS_SORTED.filter(function (name) {
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
        var cell = document.createElement('div');
        cell.className = 'portfolio-cell';

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

  if (portfolioGrid) {
    renderUnhrcPortfolio('');
    if (portfolioSearch) {
      portfolioSearch.addEventListener('input', function (e) { renderUnhrcPortfolio(e.target.value); });
    }
  }

  /* ---------------------------------------------------------
     4b. AIPPM portfolio list — render + live search (aippm.html)
  --------------------------------------------------------- */
  var aippmList = document.getElementById('aippm-portfolio-list');
  var aippmSearch = document.getElementById('aippm-search-input');
  var aippmCountNum = document.getElementById('aippm-count-num');

  /* Same rule as UNHRC: the list actually shown is always a fresh,
     programmatic alphabetical sort of the source array, by delegate name. */
  var AIPPM_PORTFOLIOS_SORTED = AIPPM_PORTFOLIOS.slice().sort(function (a, b) {
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });

  function renderAippmPortfolio(filterText) {
    if (!aippmList) return;
    var query = (filterText || '').trim().toLowerCase();
    var matches = AIPPM_PORTFOLIOS_SORTED.filter(function (p) {
      return (p.name + ' ' + p.party).toLowerCase().indexOf(query) !== -1;
    });

    aippmList.innerHTML = '';

    if (matches.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'portfolio-empty';
      empty.textContent = 'No portfolio matches your search.';
      aippmList.appendChild(empty);
    } else {
      matches.forEach(function (p) {
        var row = document.createElement('div');
        row.className = 'portfolio-row';

        var main = document.createElement('div');
        main.className = 'pr-main';

        var nameEl = document.createElement('span');
        nameEl.className = 'pr-name';
        nameEl.textContent = p.name;

        var partyEl = document.createElement('span');
        partyEl.className = 'pr-party';
        partyEl.textContent = p.party;

        main.appendChild(nameEl);
        main.appendChild(partyEl);

        var statusEl = document.createElement('span');
        statusEl.className = 'pr-status';
        statusEl.textContent = 'Not Yet Allocated';

        row.appendChild(main);
        row.appendChild(statusEl);
        aippmList.appendChild(row);
      });
    }

    if (aippmCountNum) aippmCountNum.textContent = String(matches.length);
  }

  if (aippmList) {
    renderAippmPortfolio('');
    if (aippmSearch) {
      aippmSearch.addEventListener('input', function (e) { renderAippmPortfolio(e.target.value); });
    }
  }

  /* ---------------------------------------------------------
     5. Registration — every registration action across the site
     is a direct link to https://munform.vercel.app (see the HTML).
     No JS handling is required for registration anymore.
  --------------------------------------------------------- */

})();