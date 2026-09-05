/**
 * GREHNI — AI Operating System for Smart Spaces
 * Main Application & View Controller (Supports all 15 Dedicated Views)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const navLinks = document.querySelectorAll('[data-view-target]');
  const pageViews = document.querySelectorAll('.page-view');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const siteHeader = document.querySelector('.site-header');

  /**
   * Switch Active Page View
   * @param {string} viewId - ID of view to activate
   */
  function switchView(viewId) {
    if (!viewId) return;

    // Support legacy/alias view IDs
    if (viewId === 'view-about') {
      viewId = 'view-company';
    }

    // Remove active class from all views
    pageViews.forEach(view => {
      view.classList.remove('active-view');
    });

    // Activate target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav link
    navLinks.forEach(link => {
      const targetAttr = link.getAttribute('data-view-target');
      if (targetAttr === viewId || (viewId === 'view-company' && targetAttr === 'view-about')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
    }

    // Update URL hash
    let hash = viewId.replace('view-', '');
    if (window.location.hash !== `#${hash}`) {
      history.pushState(null, '', `#${hash}`);
    }

    // Trigger re-check and staggered entry animations for the newly activated view
    if (window.triggerViewAnimations && targetView) {
      window.triggerViewAnimations(targetView);
    } else if (window.checkCounters) {
      setTimeout(window.checkCounters, 200);
    }
  }

  // Attach click listeners to all view triggers (including buttons and dropdowns)
  function attachViewListeners() {
    document.querySelectorAll('[data-view-target]').forEach(link => {
      if (!link.hasAttribute('data-has-listener')) {
        link.setAttribute('data-has-listener', 'true');
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = link.getAttribute('data-view-target');
          switchView(target);
        });
      }
    });
  }
  attachViewListeners();

  // Handle URL hash on initial load & popstate
  function handleHash() {
    const hash = window.location.hash.replace('#', '');
    const validViews = [
      'home', 'company', 'about', 'technology',
      'aroma-os', 'edge-intelligence', 'cloud-infrastructure', 'resources',
      'solutions', 'smart-homes', 'commercial-spaces', 'industrial-facilities',
      'smart-cities', 'hospitality', 'public-infrastructure', 'contact'
    ];

    if (hash === 'company' || hash === 'about') {
      switchView('view-company');
    } else if (validViews.includes(hash)) {
      switchView(`view-${hash}`);
    } else {
      // Default to Home page view
      switchView('view-home');
    }
  }

  window.addEventListener('popstate', handleHash);
  handleHash();

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Header Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // Expose switchView globally for buttons inside page content
  window.switchGrehniView = switchView;

  // =========================================================================
  // Interactive Scent Profile Switcher (Aroma OS view)
  // =========================================================================
  const scentProfiles = {
    alpha: {
      title: "Alpha Focus",
      notes: "Atlas Cedarwood · Italian Bergamot · Cardamom",
      desc: "Formulated for high-focus corporate environments, executive boardrooms, and trading floors. Modulates olfactory receptors to stabilize beta brainwaves and prevent cognitive fatigue.",
      concentration: "78%",
      rate: "45 µL/hr"
    },
    circadian: {
      title: "Circadian Reset",
      notes: "Crisp Eucalyptus · Peppermint · Pink Grapefruit",
      desc: "Invigorating high-diffusion morning profile. Triggers sympathetic nervous system stimulation, ideal for modern co-working hubs and wellness facilities.",
      concentration: "64%",
      rate: "38 µL/hr"
    },
    calm: {
      title: "Ambient Calm",
      notes: "Silver White Tea · French Lavender · Cashmere Wood",
      desc: "Designed for premium hospitality, luxury residential living rooms, and evening relaxation lounges. Low-intensity micro-droplet diffusion without scent saturation.",
      concentration: "52%",
      rate: "28 µL/hr"
    },
    sanitizing: {
      title: "Sanitizing Mist",
      notes: "Wild Thyme · Silver Fir Needle · Lemon Myrtle",
      desc: "Infused with therapeutic-grade airborne phytoncides. Active vapor cleanses airborne VOCs and leaves a clinically certified hypoallergenic atmosphere.",
      concentration: "85%",
      rate: "60 µL/hr"
    }
  };

  document.querySelectorAll('.scent-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scent-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const profileKey = btn.getAttribute('data-profile');
      const p = scentProfiles[profileKey];
      if (p) {
        const titleEl = document.getElementById('scent-title');
        const notesEl = document.getElementById('scent-notes');
        const descEl = document.getElementById('scent-desc');
        const fillEl = document.getElementById('scent-fill');
        const rateEl = document.getElementById('scent-rate');
        if (titleEl) titleEl.textContent = p.title;
        if (notesEl) notesEl.textContent = p.notes;
        if (descEl) descEl.textContent = p.desc;
        if (fillEl) fillEl.style.width = p.concentration;
        if (rateEl) rateEl.textContent = p.rate;
      }
    });
  });

  // =========================================================================
  // Interactive Code Sandbox Tabs (Resources view)
  // =========================================================================
  const codeSnippets = {
    python: `import grehni_os

# Initialize secure local gateway
client = grehni_os.Client(
    gateway_ip="192.168.1.120",
    api_key="gr_live_9f8a2bc41"
)

# Subscribe to real-time spatial sensor events
@client.on_sensor_event(zone_id="boardroom-alpha")
def handle_environmental_shift(event):
    if event.occupancy > 10 and event.tvoc > 180:
        # Boost refreshing citrus-pine micro-droplet burst
        client.dispense(profile="circadian_reset", duration_sec=15)
        print(f"[Aroma OS] Triggered burst: TVOC {event.tvoc} ppb")`,

    nodejs: `import { GrehniClient } from '@grehni/core';

const client = new GrehniClient({
  endpoint: 'https://api.grehni.com/v2',
  apiKey: process.env.GREHNI_API_KEY
});

// Monitor fleet diffusion status across all campuses
client.zones.subscribe('campus-mumbai-hq', (telemetry) => {
  console.log(\`Zone: \${telemetry.zoneName} | Status: \${telemetry.status}\`);
  console.log(\`Cartridge level: \${telemetry.cartridgeLevel}%\`);
});`,

    rest: `POST /api/v2/zones/hq-boardroom/dispense HTTP/1.1
Host: api.grehni.com
Authorization: Bearer gr_live_9f8a2bc41
Content-Type: application/json

{
  "profile_id": "alpha_cedarwood",
  "intensity_percent": 75,
  "duration_seconds": 30,
  "cfd_compensation": true,
  "hvac_damper_sync": "auto"
}`
  };

  document.querySelectorAll('.code-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.getAttribute('data-lang');
      const codeDisplay = document.getElementById('code-display');
      if (codeDisplay && codeSnippets[lang]) {
        codeDisplay.textContent = codeSnippets[lang];
      }
    });
  });
});
