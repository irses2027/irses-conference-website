import { conference } from "./data/conference.js";

/* ─────────────────────────────────────────────────────────────────────────────
   Shared site chrome (header + footer) for the multi-page site.
   Injected on every page so navigation and branding stay in one place.
   Runs before main.js, so main.js can wire the injected header/search/etc.
───────────────────────────────────────────────────────────────────────────── */

const esc = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

/* Primary navigation — single source of truth */
const NAV = [
  { id: "index", href: "index.html", label: "Home" },
  { id: "about", href: "about.html", label: "About" },
  { id: "call-for-papers", href: "call-for-papers.html", label: "Call for Papers" },
  { id: "committees", href: "committees.html", label: "Committees" },
  { id: "speakers", href: "speakers.html", label: "Speakers" },
  { id: "sponsors", href: "sponsors.html", label: "Sponsors" },
  { id: "venue", href: "venue.html", label: "Venue" },
];

/* Which page are we on? (body[data-page] wins, else the filename) */
const currentPage = () => {
  const explicit = document.body.dataset.page;
  if (explicit) return explicit;
  const file = window.location.pathname.split("/").pop() || "index.html";
  return file.replace(/\.html$/, "") || "index";
};

const active = currentPage();

const navItemMarkup = ({ id, href, label }) => {
  const isActive = id === active;
  return `<li><a href="${href}"${isActive ? ' class="is-active" aria-current="page"' : ""} data-nav-link="${id}">${esc(label)}</a></li>`;
};

const headerMarkup = `
  <div class="progress-bar" id="progress-bar" aria-hidden="true"></div>
  <header class="site-header" data-header>
    <div class="header-masthead">
      <div class="brand-logos">
        <a href="https://ieeegujaratsection.org/" target="_blank" rel="noopener noreferrer">
          <img class="brand-logo" src="assets/ieee-gujarat-section.png" alt="IEEE Gujarat Section" width="120" height="58" />
        </a>
        <a href="https://www.daiict.ac.in/" target="_blank" rel="noopener noreferrer">
          <img class="brand-logo" src="assets/dau-logo.jpg" alt="Dhirubhai Ambani University" width="120" height="58" />
        </a>
        <a href="index.html" aria-label="IRSES 2027 Home">
          <span class="conference-mark">IRSES<br />2027</span>
        </a>
      </div>

      <form class="site-search" role="search" data-site-search>
        <label class="sr-only" for="site-search-input">Search this page</label>
        <input id="site-search-input" type="search" autocomplete="off" placeholder="Search this page" data-search-input />
        <button type="submit" aria-label="Search">Search</button>
        <div class="search-results" data-search-results hidden></div>
      </form>
    </div>

    <div class="nav-row">
      <button class="menu-button" type="button" data-menu-button aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-nav" data-nav aria-label="Primary navigation">
        <ul class="nav-menu">
          ${NAV.map(navItemMarkup).join("\n          ")}
          <li><a class="nav-cta${active === "registration" ? " is-active" : ""}" href="registration.html"${active === "registration" ? ' aria-current="page"' : ""} data-nav-link="registration">Registration</a></li>
        </ul>
      </nav>
    </div>
  </header>
`;

/* Footer built from conference data so it stays accurate site-wide */
const contactBy = (label) =>
  conference.contact?.find((item) => item.label === label)?.value || "";
const email = contactBy("Conference Email");
const phone = contactBy("Phone");

const footerLinks = [...NAV, { id: "registration", href: "registration.html", label: "Registration" }]
  .filter((item) => item.id !== "index")
  .map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`)
  .join("");

const footerMarkup = `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col footer-brand">
        <span class="footer-title">IRSES 2027</span>
        <p>International Conference on Intelligent, Resilient, and Sustainable Energy Systems</p>
        <p class="footer-meta">${esc(conference.dates || "")} · ${esc(conference.venue || "")}</p>
      </div>
      <nav class="footer-col" aria-label="Footer navigation">
        <h3>Explore</h3>
        <ul>${footerLinks}</ul>
      </nav>
      <div class="footer-col">
        <h3>Contact</h3>
        <ul class="footer-contact">
          ${email ? `<li><a href="mailto:${esc(email)}">${esc(email)}</a></li>` : ""}
          ${phone ? `<li><a href="tel:${esc(phone)}">${esc(phone)}</a></li>` : ""}
          <li>Dhirubhai Ambani University,<br />Gandhinagar, Gujarat, India</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p data-footer-copy></p>
      <a class="footer-top-link" href="#top">Back to top ↑</a>
    </div>
  </footer>
  <button class="fab-top" id="fab-top" aria-label="Back to top">↑</button>
`;

/* Inject: header first (top of body), footer + fab at the end */
document.body.insertAdjacentHTML("afterbegin", headerMarkup);
document.body.insertAdjacentHTML("beforeend", footerMarkup);

/* Smooth "back to top" for the footer link (multi-page safe) */
document.querySelector(".footer-top-link")?.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
