const fs = require('fs');

let css = fs.readFileSync('./src/styles/main.css', 'utf8');

// 1. Remove force scroll
css = css.replace(/min-width:\s*500px;\s*\/\*\s*Force scroll on small screens\s*\*\//gi, '/* removed min-width: 500px */');

// 2. Fix header logos to not overflow
// .brand-logos a { ... }
css = css.replace(/\.brand-logos\s*{\s*display:\s*flex;\s*align-items:\s*center;\s*gap:\s*10px;\s*flex:\s*0\s*0\s*auto;\s*}/, 
  '.brand-logos { display: flex; align-items: center; gap: clamp(4px, 2vw, 10px); flex: 1 1 auto; flex-wrap: wrap; }');

css = css.replace(/\.brand-logo,\s*\.conference-mark\s*{\s*width:\s*82px;/g, 
  '.brand-logo,\n.conference-mark {\n  width: clamp(50px, 12vw, 82px);');

// 3. Typography fluid scaling
css = css.replace(/font-size:\s*2rem;/g, 'font-size: clamp(1.5rem, 4vw, 2rem);');
css = css.replace(/font-size:\s*1\.35rem;/g, 'font-size: clamp(1.1rem, 3vw, 1.35rem);');
css = css.replace(/font-size:\s*1\.08rem;/g, 'font-size: clamp(0.95rem, 2vw, 1.08rem);');
css = css.replace(/font-size:\s*0\.95rem;/g, 'font-size: clamp(0.85rem, 1.5vw, 0.95rem);');
css = css.replace(/font-size:\s*0\.78rem;/g, 'font-size: clamp(0.7rem, 1.2vw, 0.78rem);');

// 4. Hero section layout
// .hero-details grid-template-columns: repeat(2, minmax(0, 1fr));
css = css.replace(/grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/g, 
  'grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));');

// .hero-logo-row grid
css = css.replace(/grid-template-columns:\s*160px\s*minmax\(86px,\s*112px\)\s*160px;/g, 
  'grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));');

// 5. Grid layouts
// Find track-grid, contact-grid, etc. and make them auto-fit if they aren't already.
// We'll append general fixes at the end of the file.

fs.writeFileSync('./src/styles/main.css', css);
console.log("Applied initial CSS transformations.");
