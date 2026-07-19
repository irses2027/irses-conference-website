const fs = require('fs');

let css = fs.readFileSync('./src/styles/main.css', 'utf8');

// The ultimate responsive reset to append to main.css
const responsiveReset = `

/* ==========================================================================
   COMPREHENSIVE RESPONSIVE ENGINEERING OVERRIDES (IRSES 2027)
   ========================================================================== */

/* 1. Global Resets & Fluid Typography */
html, body {
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Fluid Typography Base */
h1 { font-size: clamp(2rem, 5vw, 3.5rem) !important; line-height: 1.1; }
h2 { font-size: clamp(1.75rem, 4vw, 2.5rem) !important; line-height: 1.2; }
h3 { font-size: clamp(1.5rem, 3vw, 2rem) !important; line-height: 1.3; }
p, li, a { font-size: clamp(1rem, 1.5vw, 1.125rem); }

/* 2. Fluid Containers */
.container,
.hero,
.hero-content,
.section,
.full-width-poster,
.site-nav,
.brand,
.logo-strip {
  width: 100% !important;
  max-width: clamp(320px, 100%, var(--container-wide, 1440px)) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: clamp(1rem, 5vw, 3rem) !important;
  padding-right: clamp(1rem, 5vw, 3rem) !important;
}

/* 3. Header & Navigation Refactor */
.site-header {
  position: relative;
  z-index: 100;
}

.brand {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: clamp(10px, 2vw, 20px);
}

.brand-logos {
  display: flex;
  align-items: center;
  gap: clamp(8px, 2vw, 16px) !important;
  flex-wrap: nowrap; /* Don't wrap logos, let them shrink */
  min-width: 0;
}

.brand-logo, 
.conference-mark {
  width: auto !important;
  max-width: clamp(50px, 12vw, 90px) !important;
  height: auto !important;
  object-fit: contain;
  flex-shrink: 1;
}

.conference-mark {
  font-size: clamp(0.7rem, 2vw, 0.85rem) !important;
}

.site-search {
  display: flex;
  flex: 1 1 200px;
  max-width: 400px;
  min-width: 0;
}

.site-search input {
  width: 100%;
  min-width: 0;
}

/* Mobile Menu Button */
.menu-button {
  display: none;
  min-height: 44px; /* Touch target */
  min-width: 44px;
}

/* Navigation */
.nav-row {
  display: flex;
  align-items: center;
}

.nav-menu {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.25rem, 1vw, 1rem);
}

/* 4. Hero Section */
.hero {
  padding-top: clamp(2rem, 10vw, 7rem) !important;
  padding-bottom: clamp(2rem, 5vw, 4rem) !important;
}

.hero-banner {
  font-size: clamp(0.85rem, 2vw, 1.25rem) !important;
}

.full-width-poster img {
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

.hero-details {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
  gap: clamp(10px, 3vw, 20px) !important;
}

.hero-logo-row {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)) !important;
  gap: clamp(10px, 3vw, 24px) !important;
}

.hero-logo-row img,
.hero-logo-seal {
  width: 100% !important;
  height: auto !important;
  max-height: 82px !important;
  object-fit: contain;
}

/* 5. Images & Media globally */
img, video, canvas, svg {
  max-width: 100% !important;
  height: auto;
}

/* 6. Cards & Grid Systems */
.track-grid,
.contact-grid,
.committee-grid,
.sponsor-card-grid,
.benefit-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)) !important;
  gap: clamp(1rem, 3vw, 2rem) !important;
}

/* Fix pricing table to stack */
.pricing-card-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

/* 7. Buttons (Touch Targets) */
.button, 
button,
a.nav-cta {
  min-height: 44px !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.5rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem) !important;
  text-align: center;
  flex-shrink: 0;
}

/* 8. Breakpoints & Media Queries for Layout Shifts */
@media (max-width: 1024px) {
  .site-nav {
    width: 100%;
  }
}

@media (max-width: 820px) {
  .brand {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .site-search {
    width: 100%;
    max-width: 100%;
    margin-top: 10px;
  }
}

@media (max-width: 768px) {
  /* Hamburger Menu Activation */
  .menu-button {
    display: flex !important;
    margin-left: auto;
  }

  .site-nav {
    display: none; /* Hide default nav on mobile */
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--primary-blue, #0A4E9B);
    flex-direction: column;
    padding: 1rem 0;
  }

  /* When JS adds an active class to nav */
  .site-nav.is-open {
    display: flex;
  }

  .nav-menu {
    flex-direction: column;
    width: 100%;
  }

  .nav-menu > li {
    width: 100%;
  }

  .nav-menu > li > a {
    width: 100%;
    padding: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .submenu {
    position: static !important;
    display: none;
    width: 100%;
    background: rgba(255,255,255,0.05);
    box-shadow: none;
    border: none;
  }

  .has-submenu.is-open > .submenu,
  .has-submenu:hover > .submenu {
    display: block !important;
  }

  .section-heading.wide {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  /* Extreme Mobile Tweaks */
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .hero-actions .button {
    width: 100%;
  }
  
  .brand-logos {
    gap: 4px !important;
  }
  
  .brand-logo, 
  .conference-mark {
    max-width: 22vw !important;
  }
}
`;

// Remove the min-width 500px entirely if it's there
css = css.replace(/min-width:\s*500px;\s*\/\*\s*Force scroll on small screens\s*\*\//g, '');

// Append our responsive resets to the end
if (!css.includes('COMPREHENSIVE RESPONSIVE ENGINEERING OVERRIDES')) {
  css += responsiveReset;
  fs.writeFileSync('./src/styles/main.css', css);
  console.log("Appended responsive resets.");
} else {
  console.log("Already appended responsive resets.");
}

