/* ═══════════════════════════════════════════════════════════════
   ERAYA SILVER — Interactions, GSAP & Locomotive Scroll
   ═══════════════════════════════════════════════════════════════ */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

(function () {
  'use strict';

  // 1. Initialize Locomotive Scroll
  const scrollEl = document.querySelector('#main-container');
  const locoScroll = new LocomotiveScroll({
    el: scrollEl,
    smooth: true,
    multiplier: 1,
    lerp: 0.08,
    class: 'is-reveal'
  });

  // 2. Sync Locomotive Scroll with GSAP ScrollTrigger
  locoScroll.on('scroll', ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(scrollEl, {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true })
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: scrollEl.style.transform ? "transform" : "fixed"
  });

  ScrollTrigger.addEventListener('refresh', () => locoScroll.update());

  // ─── 3. Loader & Initial Page Animation ────────────────────────
  const loader = document.getElementById('pageLoader');
  const loaderProgress = document.querySelector('.loader-progress');
  const loaderPercent = document.querySelector('.loader-percent');
  const brandName = document.querySelector('.loader-brand');

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 15;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);
      completeLoading();
    }
    loaderProgress.style.width = `${loadProgress}%`;
    loaderPercent.textContent = `${Math.floor(loadProgress)}%`;
  }, 100);

  // Animate brand name in loader
  gsap.to(brandName, {
    opacity: 1, y: 0,
    duration: 1, ease: "power3.out", delay: 0.2
  });
  gsap.to(loaderPercent, { opacity: 1, duration: 0.5, delay: 0.5 });

  function completeLoading() {
    const tl = gsap.timeline({
      onComplete: () => {
        loader.style.display = 'none';
        document.body.classList.add('loaded');
        initHeroAnimations();
        initScrollAnimations();
      }
    });

    tl.to(loaderPercent, { opacity: 0, duration: 0.4 })
      .to(brandName, { y: -20, opacity: 0, duration: 0.6 }, "-=0.2")
      .to('.loader-line', { scaleX: 0, opacity: 0, duration: 0.6 }, "-=0.4")
      .to(loader, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "-=0.2")
      .to('.page-transition .col', {
        scaleY: 0, transformOrigin: "top",
        duration: 0.8, stagger: 0.1, ease: "power4.inOut"
      }, "-=0.8");
  }

  // ─── 4. Hero Animations ────────────────────────────────────────
  function initHeroAnimations() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    const text = title.textContent;
    title.innerHTML = '';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      title.appendChild(span);
    });

    const tl = gsap.timeline();
    tl.to('.hero-title .char', {
      y: 0, opacity: 1,
      duration: 1, stagger: 0.05, ease: "power4.out"
    })
    .to('.hero-divider', { scaleX: 1, duration: 1, ease: "power4.inOut" }, "-=0.8")
    .to('.hero-subtitle', { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.6")
    .to('.hero-cta, .hero-scroll', { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.6");
  }

  // ─── 5. All scroll-driven animations (called AFTER loader) ─────
  function initScrollAnimations() {
    // Wait a tick for Locomotive Scroll to calculate page height
    requestAnimationFrame(() => {
      locoScroll.update();

      // ── Scroll Reveals ──
      document.querySelectorAll('.gs-reveal').forEach((el) => {
        gsap.fromTo(el,
          { y: 60, autoAlpha: 0 },
          {
            y: 0, autoAlpha: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              scroller: scrollEl,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // ── Craft Image Reveal ──
      const craftImageReveal = document.querySelector('.craft-image-reveal');
      if (craftImageReveal) {
        gsap.to(craftImageReveal, {
          scaleX: 0,
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: '.craft-image',
            scroller: scrollEl,
            start: "top 70%",
          }
        });
      }

      // ── Horizontal Scroll (Collections) ──
      const horizontalTrack = document.getElementById('horizontalTrack');
      const horizontalWrapper = document.getElementById('horizontalScroll');

      if (horizontalTrack && horizontalWrapper && window.innerWidth > 768) {
        const getScrollAmount = () => {
          const trackWidth = horizontalTrack.scrollWidth;
          const wrapperWidth = horizontalWrapper.offsetWidth;
          return -(trackWidth - wrapperWidth);
        };

        gsap.to(horizontalTrack, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalWrapper,
            scroller: scrollEl,
            start: "top 20%",
            end: () => `+=${Math.abs(getScrollAmount())}`,
            scrub: 0.5,
            invalidateOnRefresh: true,
          }
        });
      }

      // ── Number Counter (Stats) ──
      document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.to(stat, {
          innerHTML: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: '.stats-section',
            scroller: scrollEl,
            start: "top 75%"
          }
        });
      });

      // Final refresh after all triggers are set
      ScrollTrigger.refresh();
    });
  }

  // ─── 6. Canvas Background Animation (Silver Particles) ────────
  const heroCanvasEl = document.getElementById('heroCanvas');
  if (heroCanvasEl) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    heroCanvasEl.appendChild(canvas);

    let width, height, particles;

    function initCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          alpha: Math.random() * 0.5 + 0.1
        });
      }
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 1.5);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 219, 187, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(animateCanvas);
    }

    initCanvas();
    animateCanvas();
    window.addEventListener('resize', initCanvas);
  }

  // ─── 7. Navigation Scroll & Mobile Menu ────────────────────────
  const nav = document.getElementById('mainNav');
  locoScroll.on('scroll', (args) => {
    if (args.scroll.y > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileNav.classList.remove('active');
    });
  });

  // Smooth scroll anchor links via Locomotive Scroll
  document.querySelectorAll('[data-scroll-to]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = anchor.getAttribute('href');
      if (target && target.startsWith('#')) {
        const targetEl = document.querySelector(target);
        if (targetEl) {
          locoScroll.scrollTo(targetEl, { offset: 0, duration: 1200 });
        }
      }
    });
  });

  // ─── 8. Custom Cursor ──────────────────────────────────────────
  if (window.matchMedia('(min-width: 1024px)').matches) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    const interactives = document.querySelectorAll('a, button, .collection-card, .btn-premium, .magnetic');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });

    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
        gsap.to(btn, { x, y, duration: 0.5, ease: "power2.out" });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
      });
    });
  }

  // ─── 9. Resize handling ────────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      locoScroll.update();
      ScrollTrigger.refresh();
    }, 250);
  });

})();
