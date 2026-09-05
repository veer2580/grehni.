/**
 * GREHNI — AI Operating System for Smart Spaces
 * Comprehensive Site-Wide Animation Engine
 * 
 * Features:
 * 1. Interactive Ambient Particle Constellation & Rising Scent Vapor
 * 2. 3D Magnetic Card Tilt & Specular Light Reflection
 * 3. Dynamic Staggered Scroll & SPA View-Transition Reveals
 * 4. Animated Number Counters & Telemetry Ticking
 * 5. Live Telemetry Real-Time Micro-Simulation
 * 6. Button Click Ripple Effect
 */

// 1. Ambient Particle Constellation + Rising Scent Vapor
(function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let vaporPuffs = [];
  const particleCount = 55;
  const vaporCount = 14;

  let mouse = { x: -1000, y: -1000, isHovering: false };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isHovering = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
    mouse.isHovering = false;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Constellation Particle
  class Particle {
    constructor() {
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.6 + 0.8;
      this.baseAlpha = Math.random() * 0.35 + 0.2;
    }

    update() {
      // Mouse repulsion
      if (mouse.isHovering) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 110;
        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 1.8;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 117, ${this.baseAlpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00E575';
      ctx.fill();
    }
  }

  // Rising Scent Vapor Mote
  class VaporMote {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 80;
      this.vy = -(Math.random() * 0.55 + 0.3);
      this.vx = (Math.random() - 0.5) * 0.25;
      this.radius = Math.random() * 45 + 25;
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.045 + 0.02;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.y += this.vy;
      this.x += Math.sin(this.phase) * 0.4 + this.vx;
      this.phase += 0.015;

      // Fade in then out
      const progress = 1 - (this.y / height);
      if (progress < 0.25) {
        this.alpha = (progress / 0.25) * this.maxAlpha;
      } else if (progress > 0.75) {
        this.alpha = ((1 - progress) / 0.25) * this.maxAlpha;
      } else {
        this.alpha = this.maxAlpha;
      }

      if (this.y < -this.radius) {
        this.reset();
      }
    }

    draw() {
      if (this.alpha <= 0.001) return;
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, `rgba(0, 229, 117, ${this.alpha})`);
      grad.addColorStop(0.5, `rgba(16, 185, 129, ${this.alpha * 0.4})`);
      grad.addColorStop(1, 'rgba(0, 229, 117, 0)');

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());
  for (let i = 0; i < vaporCount; i++) vaporPuffs.push(new VaporMote());

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw Scent Vapor Clouds in background
    vaporPuffs.forEach(v => {
      v.update();
      v.draw();
    });

    // Draw Constellation Lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 125) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 117, ${0.14 * (1 - dist / 125)})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }
    }

    // Draw Constellation Particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
})();

// 2. 3D Magnetic Card Tilt with Specular Reflection
(function init3DCardTilt() {
  function applyTiltToCards() {
    const cardSelectors = [
      '.glass-card',
      '.industry-card',
      '.tech-pillar-card',
      '.edge-telemetry-card',
      '.dash-card',
      '.feature-big',
      '.feature-small',
      '.testi-card',
      '.resource-card',
      '.scent-step-card',
      '.dev-feature-card',
      '.stat-band-item'
    ];

    const cards = document.querySelectorAll(cardSelectors.join(', '));

    cards.forEach(card => {
      if (card.hasAttribute('data-tilt-initialized')) return;
      card.setAttribute('data-tilt-initialized', 'true');

      let bounds = null;

      card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
      });

      card.addEventListener('mousemove', (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        // Set CSS custom properties for specular highlight
        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);

        // Calculate 3D tilt angles
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;
        const tiltX = ((mouseY - centerY) / centerY) * -5.5; // Max -5.5 to +5.5 deg
        const tiltY = ((mouseX - centerX) / centerX) * 5.5;  // Max -5.5 to +5.5 deg

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        bounds = null;
        card.style.transform = '';
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      });
    });
  }

  window.reinitCardTilts = applyTiltToCards;
  document.addEventListener('DOMContentLoaded', applyTiltToCards);
})();

// 3. Staggered Scroll & Page-Switch Entrance System
(function initStaggerReveal() {
  function prepareStaggerElements() {
    const targets = document.querySelectorAll(
      '.hero-title, .section-title, .hero-description, .section-desc, ' +
      '.feature-badges-row, .hero-cta-group, ' +
      '.glass-card, .industry-card, .tech-pillar-card, .edge-telemetry-card, ' +
      '.dash-card, .feature-big, .feature-small, .testi-card, ' +
      '.platform-hero-graphic, .tech-graphic-container, .pipeline-container'
    );

    targets.forEach((el, index) => {
      if (!el.classList.contains('stagger-reveal')) {
        el.classList.add('stagger-reveal');
      }
    });

    revealVisibleElements();
  }

  function revealVisibleElements() {
    const reveals = document.querySelectorAll('.page-view.active-view .stagger-reveal:not(.revealed)');
    const windowHeight = window.innerHeight;

    reveals.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 40) {
        setTimeout(() => {
          el.classList.add('revealed');
        }, Math.min(i * 60, 600));
      }
    });
  }

  // Trigger animations whenever active view changes
  window.triggerViewAnimations = function(viewElement) {
    if (!viewElement) return;

    // Reset and animate reveals in target view
    const reveals = viewElement.querySelectorAll('.stagger-reveal');
    reveals.forEach(r => r.classList.remove('revealed'));

    setTimeout(() => {
      reveals.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 20) {
          setTimeout(() => {
            el.classList.add('revealed');
          }, Math.min(i * 55, 650));
        }
      });
    }, 80);

    // Re-bind tilts and counters
    if (window.reinitCardTilts) window.reinitCardTilts();
    if (window.checkCounters) window.checkCounters();
  };

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(revealVisibleElements);
  }, { passive: true });

  document.addEventListener('DOMContentLoaded', () => {
    prepareStaggerElements();
  });
})();

// 4. Smooth Eased Animated Counters
(function initCounterAnimations() {
  function animateValue(el, start, end, duration, prefix = '', suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * (end - start) + start);
      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
      }
    };
    window.requestAnimationFrame(step);
  }

  function observeCounters() {
    const counterElements = document.querySelectorAll('.animate-counter, [data-count]');
    counterElements.forEach(el => {
      if (el.getAttribute('data-counted') === 'true') return;

      const targetVal = el.getAttribute('data-count') || el.textContent.replace(/[^0-9]/g, '');
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';

      if (targetVal) {
        const num = parseInt(targetVal, 10);
        if (!isNaN(num) && num > 0) {
          el.setAttribute('data-counted', 'true');
          animateValue(el, 0, num, 1600, prefix, suffix);
        }
      }
    });
  }

  window.checkCounters = observeCounters;
  document.addEventListener('DOMContentLoaded', observeCounters);
})();

// 5. Button Click Liquid Ripple Effect
(function initButtonRipples() {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('btn-ripple');

        const ripple = this.querySelector('.btn-ripple');
        if (ripple) ripple.remove();

        this.appendChild(circle);
      });
    });
  });
})();

// 6. Live Telemetry & Real-Time Micro-Simulator
(function initLiveTelemetrySim() {
  document.addEventListener('DOMContentLoaded', () => {
    // Live Temperature Simulation
    const tempEl = document.getElementById('live-temp-val');
    if (tempEl) {
      const temps = ['23.0°C', '22.9°C', '23.1°C', '23.2°C', '23.0°C'];
      let idx = 0;
      setInterval(() => {
        idx = (idx + 1) % temps.length;
        tempEl.textContent = temps[idx];
      }, 3500);
    }

    // Live Signal Bars Animation on Scroll
    const signalBox = document.querySelector('.feat-signals-box');
    if (signalBox) {
      const fills = signalBox.querySelectorAll('.feat-bar-fill');
      const widths = Array.from(fills).map(f => f.style.width || '80%');
      fills.forEach(f => f.style.width = '0%');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            fills.forEach((f, i) => {
              setTimeout(() => {
                f.style.width = widths[i];
              }, i * 160);
            });
            observer.unobserve(signalBox);
          }
        });
      }, { threshold: 0.25 });

      observer.observe(signalBox);
    }
  });
})();
