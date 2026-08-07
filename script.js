/* =========================================================
   AIKTCMUN 2026 — script.js
   Vanilla ES6. No frameworks.
   ========================================================= */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. INTRO VIDEO
  --------------------------------------------------------- */
  const introScreen = document.getElementById('intro-screen');
  const introVideo = document.getElementById('intro-video');

  function endIntro(){
    if (!introScreen || introScreen.classList.contains('fade-out')) return;
    introScreen.classList.add('fade-out');
    document.body.classList.remove('no-scroll');
    window.setTimeout(() => {
      introScreen.remove();
    }, 1200);
  }

  if (introScreen && introVideo) {
    document.body.classList.add('no-scroll');

    // Safety timeout in case metadata never loads (slow network, blocked autoplay, etc.)
    const safetyTimer = window.setTimeout(endIntro, 9000);

    introVideo.addEventListener('ended', () => {
      window.clearTimeout(safetyTimer);
      endIntro();
    });

    introVideo.addEventListener('error', () => {
      window.clearTimeout(safetyTimer);
      endIntro();
    });

    // Attempt autoplay; if blocked by the browser, skip straight to content.
    const playPromise = introVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        window.clearTimeout(safetyTimer);
        endIntro();
      });
    }
  } else {
    document.body.classList.remove('no-scroll');
  }

  /* ---------------------------------------------------------
     2. NAVBAR — blur on scroll + mobile hamburger
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  function onScroll(){
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     3. SCROLL REVEAL
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------------------------------------------------
     4. ANIMATED STAT COUNTERS
  --------------------------------------------------------- */
  const statEls = document.querySelectorAll('.stat-number');
  function animateCount(el){
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    statEls.forEach(el => statIo.observe(el));
  } else {
    statEls.forEach(animateCount);
  }

  /* ---------------------------------------------------------
     5. COUNTDOWN — target 18 Sept 2026, 9:30 AM IST
  --------------------------------------------------------- */
  const COUNTDOWN_TARGET = new Date('2026-09-18T09:30:00+05:30').getTime();
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function pad(n){ return String(n).padStart(2, '0'); }

  function updateCountdown(){
    const now = Date.now();
    const diff = COUNTDOWN_TARGET - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMinutes.textContent = pad(minutes);
    cdSeconds.textContent = pad(seconds);
  }

  if (cdDays) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---------------------------------------------------------
     6. REGISTRATION FORM (front-end only demo handling)
  --------------------------------------------------------- */
  const registerForm = document.getElementById('register-form');
  const formNote = document.getElementById('form-note');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!registerForm.checkValidity()) {
        formNote.textContent = 'Please complete all fields before submitting.';
        return;
      }
      formNote.textContent = 'Registration received. The Secretariat will contact you shortly.';
      registerForm.reset();
    });
  }

  /* ---------------------------------------------------------
     7. INTERACTIVE GLOBE (Three.js)
  --------------------------------------------------------- */
  function initGlobe(){
    const wrap = document.getElementById('globe-canvas-wrap');
    const canvas = document.getElementById('globe-canvas');
    const fallback = document.getElementById('globe-fallback');
    const popup = document.getElementById('host-popup');
    const popupClose = document.getElementById('host-popup-close');

    if (!wrap || !canvas) return;

    if (typeof THREE === 'undefined') {
      canvas.hidden = true;
      if (fallback) fallback.hidden = false;
      return;
    }

    let width = wrap.clientWidth;
    let height = wrap.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);

    // Globe group holds sphere + markers so both rotate together
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Wireframe sphere (elegant, minimal — matches premium aesthetic)
    const sphereGeo = new THREE.SphereGeometry(2, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x1a3a63,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

    // Solid inner core for depth
    const coreGeo = new THREE.SphereGeometry(1.97, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x071321, transparent: true, opacity: 0.85 });
    globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // Outer glow (fresnel-ish fake via backside sphere)
    const glowGeo = new THREE.SphereGeometry(2.14, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.06 });
    globeGroup.add(new THREE.Mesh(glowGeo, glowMat));

    // --- Markers: ~40 nations, one gold (India / host) ---
    function latLngToVec3(lat, lng, radius){
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    const nations = [
      { name: 'India', lat: 20.59, lng: 78.96, host: true },
      { name: 'USA', lat: 37.09, lng: -95.71 },
      { name: 'Brazil', lat: -14.24, lng: -51.93 },
      { name: 'UK', lat: 55.38, lng: -3.44 },
      { name: 'France', lat: 46.23, lng: 2.21 },
      { name: 'Germany', lat: 51.17, lng: 10.45 },
      { name: 'Russia', lat: 61.52, lng: 105.32 },
      { name: 'China', lat: 35.86, lng: 104.20 },
      { name: 'Japan', lat: 36.20, lng: 138.25 },
      { name: 'South Korea', lat: 35.91, lng: 127.77 },
      { name: 'Australia', lat: -25.27, lng: 133.78 },
      { name: 'Canada', lat: 56.13, lng: -106.35 },
      { name: 'Mexico', lat: 23.63, lng: -102.55 },
      { name: 'South Africa', lat: -30.56, lng: 22.94 },
      { name: 'Nigeria', lat: 9.08, lng: 8.68 },
      { name: 'Egypt', lat: 26.82, lng: 30.80 },
      { name: 'Kenya', lat: -0.02, lng: 37.91 },
      { name: 'Saudi Arabia', lat: 23.89, lng: 45.08 },
      { name: 'UAE', lat: 23.42, lng: 53.85 },
      { name: 'Turkey', lat: 38.96, lng: 35.24 },
      { name: 'Indonesia', lat: -0.79, lng: 113.92 },
      { name: 'Pakistan', lat: 30.38, lng: 69.35 },
      { name: 'Bangladesh', lat: 23.68, lng: 90.36 },
      { name: 'Italy', lat: 41.87, lng: 12.57 },
      { name: 'Spain', lat: 40.46, lng: -3.75 },
      { name: 'Netherlands', lat: 52.13, lng: 5.29 },
      { name: 'Sweden', lat: 60.13, lng: 18.64 },
      { name: 'Norway', lat: 60.47, lng: 8.47 },
      { name: 'Poland', lat: 51.92, lng: 19.15 },
      { name: 'Ukraine', lat: 48.38, lng: 31.17 },
      { name: 'Argentina', lat: -38.42, lng: -63.62 },
      { name: 'Chile', lat: -35.68, lng: -71.54 },
      { name: 'Colombia', lat: 4.57, lng: -74.30 },
      { name: 'Thailand', lat: 15.87, lng: 100.99 },
      { name: 'Vietnam', lat: 14.06, lng: 108.28 },
      { name: 'Philippines', lat: 12.88, lng: 121.77 },
      { name: 'New Zealand', lat: -40.90, lng: 174.89 },
      { name: 'Israel', lat: 31.05, lng: 34.85 },
      { name: 'Iran', lat: 32.43, lng: 53.69 },
      { name: 'Kazakhstan', lat: 48.02, lng: 66.92 }
    ];

    const markerRadius = 2.03;
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);
    let hostMarkerMesh = null;

    nations.forEach(nation => {
      const isHost = !!nation.host;
      const geo = new THREE.SphereGeometry(isHost ? 0.045 : 0.028, 12, 12);
      const mat = new THREE.MeshBasicMaterial({ color: isHost ? 0xD4AF37 : 0x7fa8d9 });
      const marker = new THREE.Mesh(geo, mat);
      const pos = latLngToVec3(nation.lat, nation.lng, markerRadius);
      marker.position.copy(pos);
      marker.userData = { name: nation.name, isHost };
      markerGroup.add(marker);

      if (isHost) {
        hostMarkerMesh = marker;
        // Halo ring around India for emphasis
        const haloGeo = new THREE.RingGeometry(0.07, 0.09, 24);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.copy(pos);
        halo.lookAt(pos.clone().multiplyScalar(2));
        markerGroup.add(halo);
      }
    });

    /* --- Interaction: drag to rotate --- */
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let rotationVelocityY = 0.0016; // gentle autorotation
    let currentVelocityY = rotationVelocityY;
    let dragVelocityY = 0;

    function pointerDown(x, y){
      isDragging = true;
      prevX = x; prevY = y;
      dragVelocityY = 0;
    }
    function pointerMove(x, y){
      if (!isDragging) return;
      const dx = x - prevX;
      const dy = y - prevY;
      globeGroup.rotation.y += dx * 0.005;
      globeGroup.rotation.x += dy * 0.005;
      globeGroup.rotation.x = Math.max(-0.9, Math.min(0.9, globeGroup.rotation.x));
      dragVelocityY = dx * 0.005;
      prevX = x; prevY = y;
    }
    function pointerUp(){
      isDragging = false;
      currentVelocityY = dragVelocityY !== 0 ? dragVelocityY : rotationVelocityY;
    }

    wrap.addEventListener('mousedown', e => pointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => pointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', pointerUp);

    wrap.addEventListener('touchstart', e => {
      const t = e.touches[0];
      pointerDown(t.clientX, t.clientY);
    }, { passive: true });
    wrap.addEventListener('touchmove', e => {
      const t = e.touches[0];
      pointerMove(t.clientX, t.clientY);
    }, { passive: true });
    wrap.addEventListener('touchend', pointerUp);

    /* --- Click / tap on India marker opens popup --- */
    const raycaster = new THREE.Raycaster();
    const pointerVec = new THREE.Vector2();
    let dragDistance = 0;

    wrap.addEventListener('mousedown', () => { dragDistance = 0; });
    wrap.addEventListener('mousemove', e => { if (isDragging) dragDistance += Math.abs(e.movementX || 0); });

    function handleTap(clientX, clientY){
      if (dragDistance > 6) return; // treat as drag, not tap
      const rect = wrap.getBoundingClientRect();
      pointerVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerVec, camera);
      const intersects = raycaster.intersectObjects(markerGroup.children);
      if (intersects.length > 0) {
        const hit = intersects.find(i => i.object.userData && i.object.userData.isHost);
        if (hit) openHostPopup();
      }
    }

    wrap.addEventListener('click', e => handleTap(e.clientX, e.clientY));
    wrap.addEventListener('touchend', e => {
      if (e.changedTouches && e.changedTouches[0]) {
        const t = e.changedTouches[0];
        handleTap(t.clientX, t.clientY);
      }
    });

    function openHostPopup(){
      if (!popup) return;
      popup.hidden = false;
    }
    function closeHostPopup(){
      if (!popup) return;
      popup.hidden = true;
    }
    if (popupClose) popupClose.addEventListener('click', closeHostPopup);
    if (popup) {
      popup.addEventListener('keydown', e => { if (e.key === 'Escape') closeHostPopup(); });
    }

    /* --- Resize handling --- */
    function handleResize(){
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    /* --- Render loop --- */
    function animate(){
      requestAnimationFrame(animate);
      if (!isDragging && !reduceMotion) {
        globeGroup.rotation.y += currentVelocityY;
        currentVelocityY += (rotationVelocityY - currentVelocityY) * 0.02;
      }
      renderer.render(scene, camera);
    }
    animate();
  }

  // Kick off globe once DOM + Three.js are ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobe);
  } else {
    initGlobe();
  }

})();