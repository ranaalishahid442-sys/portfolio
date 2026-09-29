/**
 * ==========================================================================
 * WARM CRAFT RETRO — INTERACTION & ANIMATION CONTROLLER
 * Author: Ali Shahid Portfolio (v2)
 * Pure vanilla JavaScript — zero dependencies, fully self-contained.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. DYNAMIC TEXT ANIMATION (ROLE ROTATOR / TYPEWRITER)
     -------------------------------------------------------------------------- */
  const roleElement = document.getElementById('roleRotator');
  if (roleElement && !prefersReducedMotion) {
    const roles = [
      'Mobile App Development',
      'AI & Voice Applications',
      'React & TypeScript Systems',
      'Cross-Platform Engineering',
      'Pixel-Precise Interfaces',
      'Android & Full-Stack Web'
    ];

    let currentRoleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 60;

    function tick() {
      const fullText = roles[currentRoleIdx];

      if (isDeleting) {
        roleElement.textContent = fullText.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 30;
      } else {
        roleElement.textContent = fullText.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 65;
      }

      if (!isDeleting && charIdx === fullText.length) {
        typeSpeed = 2200; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        currentRoleIdx = (currentRoleIdx + 1) % roles.length;
        typeSpeed = 450; // Pause before typing next word
      }

      setTimeout(tick, typeSpeed);
    }

    // Start with a slight initial delay
    setTimeout(tick, 800);
  }

  /* --------------------------------------------------------------------------
     2. 3D PERSPECTIVE TILT ON PHOTO CARD (DESKTOP)
     -------------------------------------------------------------------------- */
  const tiltCardWrapper = document.getElementById('photoTiltCard');
  if (tiltCardWrapper && !prefersReducedMotion && window.matchMedia('(min-width: 768px)').matches) {
    const card = tiltCardWrapper.querySelector('.craft-photo-card');

    tiltCardWrapper.addEventListener('mousemove', (e) => {
      const rect = tiltCardWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Limit tilt to +/- 8 degrees for sophisticated, non-jarring feel
      const rotateX = ((centerY - y) / centerY) * 7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCardWrapper.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* --------------------------------------------------------------------------
     3. STICKY NAVBAR, PROGRESS BAR & ACTIVE SECTION HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('craftNav');
  const navLinks = document.querySelectorAll('.craft-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  window.addEventListener('scroll', () => {
    // 1. Sticky state
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 2. Reading progress bar
    if (scrollProgressBar) {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollProgressBar.style.width = `${scrolled}%`;
    }

    // 3. Determine active section
    let currentSection = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  /* --------------------------------------------------------------------------
     4. MOBILE DRAWER NAVIGATION
     -------------------------------------------------------------------------- */
  const burgerToggle = document.getElementById('burgerToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('active');
    burgerToggle.classList.add('active');
    burgerToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    burgerToggle.classList.remove('active');
    burgerToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (burgerToggle) {
    burgerToggle.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* --------------------------------------------------------------------------
     5. SMOOTH SCROLLING FOR ALL INTERNAL ANCHORS
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. SCROLL REVEALS & NUMBER COUNT-UP (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Check if this element or child has number count-up
          const statNumber = entry.target.querySelector('.stat-number');
          if (statNumber && !statNumber.dataset.counted) {
            statNumber.dataset.counted = 'true';
            animateCount(statNumber);
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    if (!target) return;
    const isFps = el.textContent.includes('fps');
    const isPercent = el.textContent.includes('%');
    let current = 0;
    const increment = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + (isFps ? 'fps' : isPercent ? '%' : '');
    }, 35);
  }

  /* --------------------------------------------------------------------------
     7. PROJECT FILTER TABS
     -------------------------------------------------------------------------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card-craft');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const catList = category.split(' ');
        if (filter === 'all' || catList.includes(filter)) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     8. SPECIFICATIONS MODAL WITH DYNAMIC PROJECT DATA
     -------------------------------------------------------------------------- */
  const projectModal = document.getElementById('projectModal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseAction = document.getElementById('modalCloseAction');
  const modalBackdrop = document.getElementById('modalBackdrop');

  const modalKicker = document.getElementById('modalKicker');
  const modalTitle = document.getElementById('modalTitle');
  const modalSummary = document.getElementById('modalSummary');
  const modalPlatform = document.getElementById('modalPlatform');
  const modalArch = document.getElementById('modalArch');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalStatus = document.getElementById('modalStatus');
  const modalRepoBtn = document.getElementById('modalRepoBtn');

  const projectDetails = {
    flowfit: {
      kicker: "Mobile App · Capacitor 8.x",
      title: "FlowFit — AI & Workout Tracker",
      summary: "High-performance fitness tracking mobile application with an interactive exercise directory, metabolic macro calculator, and background workout audio.",
      platform: "Android Native & Web",
      arch: "Capacitor 8.x · Android Studio · JS · CSS3",
      features: "3D Fitness Avatars · Muscle Maps · Dynamic Island Audio · Offline Cache",
      status: "Android Native Ready",
      repo: "https://github.com/ranaalishahid442-sys/FlowFit"
    },
    bolkisan: {
      kicker: "Voice AI · Trilingual Agriculture",
      title: "Bol-Kisan (بول کسان)",
      summary: "Voice-first AI assistant empowering Pakistani farmers across Urdu, Punjabi, and Saraiki dialects with Gemini Flash multimodal audio, rain radar, and live market rates.",
      platform: "Full-Stack Web & Multimodal AI",
      arch: "Gemini 2.5 Flash · React 18 · Express 5.x · Edge TTS",
      features: "Trilingual Dialect Engine · Open-Meteo Radar · Mandi Rates · Noto Nastaliq",
      status: "Production AI Ready",
      repo: "https://github.com/ranaalishahid442-sys/Bol-Kisan"
    },
    aridhostel: {
      kicker: "Enterprise Portal · React 19 & TS",
      title: "PMAS Arid Hostel Portal",
      summary: "Official student residence portal for PMAS-AAUR featuring merit notifications, verifiable bank fee challan generation (PKR 18,500), and interactive bed vacancy booking.",
      platform: "Full-Stack Web (Desktop & Mobile)",
      arch: "React 19 · TypeScript · Vite · Tailwind CSS",
      features: "Fee Challan Slips (PKR 18.5k) · Roommate Matcher · Live Bed Vacancy Grid",
      status: "Campus Platform Ready",
      repo: "https://github.com/ranaalishahid442-sys/arid-hostel-portal"
    }
  };

  function openModal(modalKey) {
    const data = projectDetails[modalKey] || projectDetails.flowfit;
    if (data) {
      if (modalKicker) modalKicker.textContent = data.kicker;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalSummary) modalSummary.textContent = data.summary;
      if (modalPlatform) modalPlatform.textContent = data.platform;
      if (modalArch) modalArch.textContent = data.arch;
      if (modalFeatures) modalFeatures.textContent = data.features;
      if (modalStatus) modalStatus.textContent = data.status;
      if (modalRepoBtn) modalRepoBtn.href = data.repo;
    }

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-modal') || 'flowfit';
      openModal(key);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCloseAction) modalCloseAction.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  /* --------------------------------------------------------------------------
     9. GMAIL DIRECT COMPOSE & COPY TOAST
     -------------------------------------------------------------------------- */
  const openGmailBtn = document.getElementById('openGmailBtn');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastNotice = document.getElementById('toastNotice');

  function triggerToast(message) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('visible');
    setTimeout(() => {
      toastNotice.classList.remove('visible');
    }, 3200);
  }

  if (openGmailBtn) {
    openGmailBtn.addEventListener('click', () => {
      triggerToast('✓ Opening Gmail with ranaalishahid442@gmail.com...');
      try {
        navigator.clipboard.writeText('ranaalishahid442@gmail.com');
      } catch (err) {}
    });
  }

  if (copyEmailBtn && toastNotice) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'ranaalishahid442@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        // Fallback for direct file:// or older permissions
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      triggerToast('✓ Copied to clipboard: ' + email);
    });
  }

  /* --------------------------------------------------------------------------
     10. MOBILE PROJECTS CAROUSEL SWIPE INDICATOR
     -------------------------------------------------------------------------- */
  const projectsTrack = document.getElementById('projectsTrack');
  const carouselThumb = document.getElementById('carouselThumb');

  if (projectsTrack && carouselThumb) {
    projectsTrack.addEventListener('scroll', () => {
      const maxScroll = projectsTrack.scrollWidth - projectsTrack.clientWidth;
      if (maxScroll > 0) {
        const ratio = projectsTrack.scrollLeft / maxScroll;
        carouselThumb.style.transform = `translateX(${ratio * 200}%)`;
      }
    }, { passive: true });
  }

});
