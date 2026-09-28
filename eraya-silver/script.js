/* ═══════════════════════════════════════════════════════════════
   ERAYA SILVER — Premium Interactions & Animations
   Luxury should feel slow, intentional and controlled.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Page Loader ─── */
  const loader = document.getElementById('pageLoader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      animateHero();
    }, 1400);
  });

  /* ─── Hero Entry Animations ─── */
  function animateHero() {
    const hero = document.querySelector('.hero');
    const title = document.querySelector('.hero-title');
    const divider = document.querySelector('.hero-divider');
    const subtitle = document.querySelector('.hero-subtitle');
    const scroll = document.querySelector('.hero-scroll');

    hero.classList.add('in-view');

    // Title
    setTimeout(() => {
      title.style.transition = 'opacity 1.4s cubic-bezier(0.16,1,0.3,1), transform 1.4s cubic-bezier(0.16,1,0.3,1)';
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
    }, 200);

    // Divider
    setTimeout(() => {
      divider.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(0.16,1,0.3,1)';
      divider.style.opacity = '1';
      divider.style.transform = 'scaleX(1)';
    }, 800);

    // Subtitle
    setTimeout(() => {
      subtitle.style.transition = 'opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)';
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
    }, 1100);

    // Scroll indicator
    setTimeout(() => {
      scroll.style.transition = 'opacity 1s ease';
      scroll.style.opacity = '1';
    }, 2000);
  }

  /* ─── Navigation Scroll Effect ─── */
  const nav = document.getElementById('mainNav');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ─── Mobile Navigation ─── */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ─── Scroll Reveal Observer ─── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ─── Parallax Effect on Hero ─── */
  const heroBg = document.querySelector('.hero-bg img');

  function handleParallax() {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrollY <= heroHeight) {
      const parallaxOffset = scrollY * 0.35;
      heroBg.style.transform = `scale(1) translateY(${parallaxOffset}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  /* ─── Smooth Scroll for Anchor Links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = nav.offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ─── Collection Item Magnetic Hover ─── */
  const collectionItems = document.querySelectorAll('.collection-item');

  collectionItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;

      const img = item.querySelector('img');
      img.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
    });

    item.addEventListener('mouseleave', () => {
      const img = item.querySelector('img');
      img.style.transition = 'transform 1.5s cubic-bezier(0.16,1,0.3,1)';
      img.style.transform = 'scale(1) translate(0, 0)';

      setTimeout(() => {
        img.style.transition = 'transform 1.5s cubic-bezier(0.16,1,0.3,1), filter 0.8s ease';
      }, 100);
    });
  });

  /* ─── Craft Image Subtle Float ─── */
  const craftImg = document.querySelector('.craft-image');

  if (craftImg) {
    const craftObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            craftImg.style.animation = 'subtleFloat 6s ease-in-out infinite';
          } else {
            craftImg.style.animation = 'none';
          }
        });
      },
      { threshold: 0.3 }
    );

    craftObserver.observe(craftImg);
  }

  // Add the float keyframes dynamically
  const floatStyle = document.createElement('style');
  floatStyle.textContent = `
    @keyframes subtleFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `;
  document.head.appendChild(floatStyle);

  /* ─── Newsletter Form ─── */
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button');
      const originalText = btn.textContent;

      btn.textContent = 'Thank you';
      btn.style.background = '#3a4219';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        newsletterForm.reset();
      }, 3000);
    });
  }

  /* ─── Cursor Trail (Desktop Only) ─── */
  if (window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(hover: none)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(78, 89, 35, 0.4);
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease, background 0.3s ease;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    const cursorOuter = document.createElement('div');
    cursorOuter.style.cssText = `
      position: fixed;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      border: 1px solid rgba(78, 89, 35, 0.2);
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
    `;
    document.body.appendChild(cursorOuter);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX - 4 + 'px';
      cursor.style.top = e.clientY - 4 + 'px';
      cursorOuter.style.left = e.clientX - 17.5 + 'px';
      cursorOuter.style.top = e.clientY - 17.5 + 'px';
    });

    // Enlarge cursor on interactive elements
    const interactives = document.querySelectorAll('a, button, .collection-item, .editorial-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOuter.style.width = '50px';
        cursorOuter.style.height = '50px';
        cursorOuter.style.left = parseFloat(cursorOuter.style.left) - 7.5 + 'px';
        cursorOuter.style.top = parseFloat(cursorOuter.style.top) - 7.5 + 'px';
        cursorOuter.style.borderColor = 'rgba(243, 219, 187, 0.4)';
        cursor.style.background = 'rgba(243, 219, 187, 0.6)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOuter.style.width = '35px';
        cursorOuter.style.height = '35px';
        cursorOuter.style.borderColor = 'rgba(78, 89, 35, 0.2)';
        cursor.style.background = 'rgba(78, 89, 35, 0.4)';
      });
    });
  }

  /* ─── Image Lazy Reveal ─── */
  const images = document.querySelectorAll('.collection-item img, .editorial-card-image img, .craft-image img');

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          imageObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 1.2s ease, transform 1.5s cubic-bezier(0.16,1,0.3,1), filter 0.8s ease';
    imageObserver.observe(img);
  });

  /* ─── Brand Story Pillar Counter Animation ─── */
  const pillars = document.querySelectorAll('.brand-pillar');

  const pillarObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transition = `opacity 0.8s ${index * 0.15}s cubic-bezier(0.16,1,0.3,1), transform 0.8s ${index * 0.15}s cubic-bezier(0.16,1,0.3,1)`;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          pillarObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  pillars.forEach(p => {
    p.style.opacity = '0';
    p.style.transform = 'translateY(30px)';
    pillarObserver.observe(p);
  });

  /* ─── Performance: Reduce Animations on Low-Power Devices ─── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });

    pillars.forEach(p => {
      p.style.opacity = '1';
      p.style.transform = 'none';
    });
  }

})();
