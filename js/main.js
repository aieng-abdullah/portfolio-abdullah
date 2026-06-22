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

  // Navbar background on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.style.borderBottomColor = 'var(--card-border)';
    } else {
      navbar.style.borderBottomColor = 'transparent';
    }
    lastScroll = currentScroll;
  });

  // Hero entrance animation
  setTimeout(() => {
    const heroEyebrow = document.querySelector('.hero-eyebrow');
    const heroLines = document.querySelectorAll('.hero-heading .line-inner');
    const heroDesc = document.querySelector('.hero-desc');
    const heroCta = document.querySelector('.hero-cta');

    const heroImage = document.querySelector('.hero-image');

    if (heroImage) {
      heroImage.style.opacity = '1';
      heroImage.style.transform = 'translateY(0)';
      heroImage.style.transition = 'opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
    }

    if (heroEyebrow) {
      heroEyebrow.style.opacity = '1';
      heroEyebrow.style.transform = 'translateY(0)';
      heroEyebrow.style.transition = 'opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
    }

    heroLines.forEach((line, i) => {
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
        line.style.transition = 'opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
      }, 200 + i * 150);
    });

    if (heroDesc) {
      setTimeout(() => {
        heroDesc.style.opacity = '1';
        heroDesc.style.transform = 'translateY(0)';
        heroDesc.style.transition = 'opacity 0.7s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1)';
      }, 600);
    }

    if (heroCta) {
      setTimeout(() => {
        heroCta.style.opacity = '1';
        heroCta.style.transform = 'translateY(0)';
        heroCta.style.transition = 'opacity 0.7s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1)';
      }, 800);
    }
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
});
