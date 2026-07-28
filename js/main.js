document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  // Theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    const sun = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    const moon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    themeToggle.innerHTML = theme === 'dark' ? moon : sun;
  }

  // Mobile nav
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Active nav on scroll
  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // Navbar blur + scroll progress + scroll-to-top (combined scroll handler)
  let lastScroll = 0;
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (currentScroll / docHeight) * 100;

    // Scroll progress bar
    if (scrollProgress) {
      scrollProgress.style.width = scrollPercent + '%';
    }

    // Navbar blur
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button
    if (scrollTopBtn) {
      if (currentScroll > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    lastScroll = currentScroll;
  });

  // Scroll-to-top click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Cursor follower
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  if (cursorDot && cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX - 4 + 'px';
      cursorDot.style.top = mouseY - 4 + 'px';
      cursorDot.classList.add('active');
      cursorGlow.classList.add('active');
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      cursorGlow.style.left = glowX - 20 + 'px';
      cursorGlow.style.top = glowY - 20 + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-tag, .faq-item');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover'));
    });
  }

  // Project card tilt effect
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s var(--ease-out)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });

  // Hero entrance animation (Framer Motion style stagger)
  const ease = 'cubic-bezier(0.165, 0.84, 0.44, 1)';

  function animateIn(el, delay, opts = {}) {
    if (!el) return;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = opts.scale ? 'translateY(0) scale(1)' : 'translateY(0)';
      el.style.transition = `opacity 0.6s ${ease}, transform 0.6s ${ease}`;
    }, delay);
  }

  setTimeout(() => {
    // Skill pills - staggered fade in
    const skillPills = document.querySelectorAll('.hero-skills-strip .skill-tag');
    skillPills.forEach((pill, i) => {
      animateIn(pill, 100 + i * 60, { scale: true });
    });

    // Eyebrow
    animateIn(document.querySelector('.hero-eyebrow'), 200);

    // Name - slide up
    const heroLines = document.querySelectorAll('.hero-heading .line-inner');
    heroLines.forEach((line, i) => {
      animateIn(line, 350 + i * 150);
    });

    // Role badges
    const roleBadges = document.querySelectorAll('.hero-left .skill-tag-featured');
    roleBadges.forEach((badge, i) => {
      animateIn(badge, 650 + i * 100, { scale: true });
    });

    // Description
    animateIn(document.querySelector('.hero-desc'), 750);

    // Social icons - staggered pop
    const socialIcons = document.querySelectorAll('.hero-social a');
    socialIcons.forEach((icon, i) => {
      animateIn(icon, 850 + i * 80, { scale: true });
    });

    // CTA buttons
    animateIn(document.querySelector('.hero-cta'), 1100);

    // Hero photo - slide up with scale
    const heroPhoto = document.querySelector('.hero-photo');
    if (heroPhoto) {
      setTimeout(() => {
        heroPhoto.style.opacity = '1';
        heroPhoto.style.transform = 'translateY(0) scale(1)';
        heroPhoto.style.transition = `opacity 0.8s ${ease}, transform 0.8s ${ease}`;
      }, 400);
    }

    // Stats - staggered rise
    const statItems = document.querySelectorAll('.hero-stats .hero-stat-item');
    statItems.forEach((stat, i) => {
      animateIn(stat, 1200 + i * 120);
    });
  }, 300);

  // Matrix background
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops;

    function initCanvas() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      const fontSize = 14;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    }

    initCanvas();
    window.addEventListener('resize', initCanvas);

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

    function drawMatrix() {
      ctx.fillStyle = 'rgba(24, 19, 18, 0.04)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(252, 170, 45, 0.08)';
      ctx.font = '14px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 14, drops[i] * 14);
        if (drops[i] * 14 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    setInterval(drawMatrix, 60);
  }

  // Contact form
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-primary');
      const span = btn.querySelector('span');
      const origText = span.textContent;

      span.textContent = 'Sending...';
      btn.style.pointerEvents = 'none';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          span.textContent = 'Message Sent!';
          btn.style.background = '#22c55e';
          btn.style.borderColor = '#22c55e';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        span.textContent = 'Failed to send';
        btn.style.background = '#dc2626';
        btn.style.borderColor = '#dc2626';
      }

      setTimeout(() => {
        span.textContent = origText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.pointerEvents = '';
      }, 3000);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Medium blog posts
  window.renderMediumPosts = function (data) {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    if (!data || data.status !== 'ok' || !data.items || !data.items.length) {
      grid.innerHTML =
        '<div class="blog-error" style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--muted);">Unable to load articles. <a href="https://medium.com/@aieng.abdullah.arif" target="_blank" rel="noopener" style="color:var(--accent);">Visit Medium →</a></div>';
      return;
    }

    grid.innerHTML = '';
    const items = data.items.slice(0, 6);

    items.forEach((item, i) => {
      const card = document.createElement('a');
      card.href = item.link;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = `blog-card reveal-up stagger-${(i % 3) + 1}`;

      const desc = item.description
        .replace(/<[^>]*>/g, '')
        .substring(0, 160)
        .replace(/\s+\S*$/, '');

      card.innerHTML = `
        <div class="blog-card-label">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
          </svg>
          Medium
        </div>
        <h3></h3>
        <p></p>
        <span class="blog-card-read">Read on Medium <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
      `;

      card.querySelector('h3').textContent = item.title;
      card.querySelector('p').textContent = desc + '…';

      grid.appendChild(card);

      setTimeout(() => {
        card.classList.add('is-visible');
      }, 100 + i * 120);
    });
  }

  function loadMediumPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    grid.innerHTML =
      '<div class="blog-loading" style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--muted);">Loading articles...</div>';

    const rssUrl = 'https://medium.com/feed/@aieng.abdullah.arif';
    const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    fetch(apiUrl, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        clearTimeout(timeout);
        renderMediumPosts(data);
      })
      .catch(() => {
        clearTimeout(timeout);
        const script = document.createElement('script');
        script.src = apiUrl + '&callback=renderMediumPosts';
        script.onerror = () => renderMediumPosts(null);
        document.body.appendChild(script);
      });
  }

  loadMediumPosts();

  // Smooth word-by-word reveal on hero heading hover
  const heroHeading = document.querySelector('.hero-heading .line-inner');
  if (heroHeading) {
    const originalText = heroHeading.textContent;
    const words = originalText.split(' ');
    heroHeading.innerHTML = words.map(w => `<span class="word-wrap"><span class="word">${w}</span></span>`).join(' ');
    const wordEls = heroHeading.querySelectorAll('.word');

    heroHeading.addEventListener('mouseenter', () => {
      wordEls.forEach((word, i) => {
        word.style.transition = `opacity 0.3s ${i * 0.05}s var(--ease-out), transform 0.3s ${i * 0.05}s var(--ease-out)`;
        word.style.opacity = '0';
        word.style.transform = 'translateY(8px)';
        setTimeout(() => {
          word.style.opacity = '1';
          word.style.transform = 'translateY(0)';
        }, 50 + i * 60);
      });
    });
  }

  // Animated counters
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    statNumbers.forEach(el => {
      const text = el.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      const duration = 1500;
      const start = performance.now();

      el.classList.add('counting');

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
          el.classList.remove('counting');
        }
      }
      requestAnimationFrame(update);
    });
  }

  // Trigger counters when hero stats come into view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 1300);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // Parallax on hero background
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    });
  }

  // Lazy image loading
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });
});
