import { conference } from "./data/conference.js";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const text = (selector, value) => {
  const element = document.querySelector(selector);
  if (!element) return;
  element.textContent = value;
  if (value === "") element.hidden = true;
};

const html = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const attr = html;

const initials = (name) =>
  name
    .replace(/^(Prof\.|Dr\.)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

/* ─── Text content ─────────────────────────────────────────────────────────── */
text("[data-event-label]", conference.label);
text("[data-event-dates]", conference.dates);
text("[data-event-venue]", conference.venue);
text("[data-event-description]", conference.description);
text("[data-event-purpose]", conference.purpose);
text("[data-venue-title]", conference.venueDetails.title);
text("[data-venue-description]", conference.venueDetails.description);
text("[data-footer-copy]", conference.footer);
text("[data-no-show-policy]", conference.registrationGuidelines.noShow);

/* ─── Logo strip ──────────────────────────────────────────────────────────── */
const logoMarkup = (logo) =>
  `<figure class="logo-card">
    <img src="${attr(logo.src)}" alt="${attr(logo.name)}" loading="lazy" />
  </figure>`;

const logos = document.querySelector("[data-logos]");
if (logos) {
  logos.innerHTML = conference.logos.map(logoMarkup).join("");
}

/* ─── Important Dates — vertical timeline ─────────────────────────────────── */
// const dates = document.querySelector("[data-important-dates]");
// if (dates) {
//   dates.innerHTML = conference.importantDates
//     .map(
//       (item) => `
//     <article class="date-card">
//       <div class="date-card-inner">
//         <p>${html(item.label)}</p>
//         <strong>${html(item.date)}</strong>
//         <span>${html(item.note)}</span>
//       </div>
//     </article>
//   `,
//     )
//     .join("");
// }

const timelineIcons = {
  registration: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  upload: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
};

const pickTimelineIcon = (label = "") => {
  const key = label.toLowerCase();
  if (key.includes("regist")) return timelineIcons.registration;
  if (key.includes("submission")) return timelineIcons.upload;
  if (key.includes("accept")) return timelineIcons.check;
  return timelineIcons.calendar;
};

const dates = document.querySelector("[data-important-dates]");
if (dates) {
  dates.innerHTML = conference.importantDates
    .map(
      (item) => `
    <div class="timeline-item">
      <div class="timeline-icon">${pickTimelineIcon(item.label)}</div>
      <div class="timeline-dot"></div>
      <p class="timeline-label">${html(item.label)}</p>
      <span class="timeline-date">${html(item.date)}</span>
    </div>
  `,
    )
    .join("");
}

/* ─── Technical Tracks ─────────────────────────────────────────────────────── */
// const tracks = document.querySelector("[data-tracks]");
// if (tracks) {
//   tracks.innerHTML = conference.tracks
//     .map(
//       (track, index) => `
//     <article class="track-card">
//       <span class="track-number">${String(index + 1).padStart(2, "0")}</span>
//       <div class="track-content">
//         <h3>${html(track.title)}</h3>
//         <ul>
//           ${track.scope.map((item) => `<li>${html(item)}</li>`).join("")}
//         </ul>
//       </div>
//     </article>
//   `,
//     )
//     .join("");
// }
const tracks = document.querySelector("[data-tracks]");
if (tracks) {
  tracks.innerHTML = conference.tracks
    .map((track, index) => {
      const num = String(index + 1).padStart(2, "0");
      const tags = (track.audience || [])
        .map((tag) => `<span class="track-tag">${html(tag)}</span>`)
        .join("");
      const scopeItems = track.scope
        .map((item) => `<li>${html(item)}</li>`)
        .join("");

      return `
        <article class="track-card">
          <div class="track-card-header">
            <span class="track-pill-number">Track ${num}</span>
            <span class="track-pill-title">${html(track.title)}</span>
          </div>
          <div class="track-tags">${tags}</div>
          <div class="track-body">
            <h3>Overview</h3>
            ${track.overview ? `<p>${html(track.overview)}</p>` : ""}
            <ul class="track-scope-list" data-collapsed="true">${scopeItems}</ul>
            <button type="button" class="track-toggle" data-track-toggle>
              View more <span aria-hidden="true">▾</span>
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  tracks.querySelectorAll("[data-track-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const list = btn.parentElement.querySelector(".track-scope-list");
      const collapsed = list.dataset.collapsed === "true";
      list.dataset.collapsed = collapsed ? "false" : "true";
      btn.innerHTML = collapsed
        ? 'View less <span aria-hidden="true">▴</span>'
        : 'View more <span aria-hidden="true">▾</span>';
    });
  });
}

/* ─── Author guidelines ───────────────────────────────────────────────────── */
text("[data-author-eyebrow]", conference.authorGuidelines.eyebrow);
text("[data-author-title]", conference.authorGuidelines.title);
text("[data-author-intro]", conference.authorGuidelines.intro);

const authorActions = document.querySelector("[data-author-actions]");
if (authorActions) {
  authorActions.innerHTML = conference.authorGuidelines.actions
    .map(
      (action) => `
      <a class="authors-button ${action.style === "primary" ? "authors-button-primary" : "authors-button-secondary"}" href="${attr(action.href)}" target="_blank" rel="noopener">
        ${html(action.label)}
      </a>
    `,
    )
    .join("");
}

const authorEssentials = document.querySelector("[data-author-essentials]");
if (authorEssentials) {
  authorEssentials.innerHTML = conference.authorGuidelines.essentials
    .map(
      (item) => `
      <div>
        <dt>${html(item.label)}</dt>
        <dd>${html(item.value)}</dd>
      </div>
    `,
    )
    .join("");
}

const authorJumpNav = document.querySelector("[data-author-jump-nav]");
if (authorJumpNav) {
  authorJumpNav.innerHTML = conference.authorGuidelines.sections
    .map((section) => `<a href="#${attr(section.id)}">${html(section.title)}</a>`)
    .join("");
}

const authorListMarkup = (section) => {
  if (!section.items) return "";
  const tag = section.ordered ? "ol" : "ul";
  return `
    <${tag} class="${section.ordered ? "authors-step-list" : "authors-check-list"}">
      ${section.items.map((item) => `<li>${html(item)}</li>`).join("")}
    </${tag}>
  `;
};

const authorSpecsMarkup = (section) => {
  if (!section.specifications) return "";
  return `
    <div class="authors-spec-table" role="table" aria-label="${section.title}">
      ${section.specifications
        .map(
          (spec) => `
          <div class="authors-spec-row" role="row">
            <div role="cell">${html(spec.label)}</div>
            <strong role="cell">${html(spec.value)}</strong>
          </div>
        `,
        )
        .join("")}
    </div>
  `;
};

const authorSections = document.querySelector("[data-author-sections]");
if (authorSections) {
  authorSections.innerHTML = conference.authorGuidelines.sections
    .map(
      (section) => `
      <article class="authors-card ${section.specifications ? "authors-card-wide" : ""}" id="${attr(section.id)}">
        <span class="authors-card-label">${html(section.label)}</span>
        <h3>${html(section.title)}</h3>
        <p>${html(section.description)}</p>
        ${authorSpecsMarkup(section)}
        ${authorListMarkup(section)}
      </article>
    `,
    )
    .join("");
}

const authorCmt = document.querySelector("[data-author-cmt]");
if (authorCmt) {
  authorCmt.innerHTML = `
    <span>Microsoft CMT Acknowledgement</span>
    <p>${html(conference.authorGuidelines.cmtAcknowledgement)}</p>
  `;
}

/* ─── Committees ───────────────────────────────────────────────────────────── */
const memberMarkup = (member) => {
  const person = typeof member === "string" ? { name: member } : member;
  const media = person.image
    ? `<img src="${attr(person.image)}" alt="${attr(person.name)}" loading="lazy" />`
    : `<span class="member-initials" aria-hidden="true">${initials(person.name)}</span>`;

  const infoLink = person.infoLink
    ? `<a class="member-link" href="${attr(person.infoLink)}" target="_blank" rel="noopener" aria-label="View ${attr(person.name)}'s profile">More info</a>`
    : "";
  const institute = person.institute
    ? `<span class="member-institute">${html(person.institute.trim())}</span>`
    : "";

  return `
    <li class="committee-member">
      <div class="member-photo">${media}</div>
      <div class="member-info">
        <span class="member-name">${html(person.name)}</span>
        ${institute}
        ${infoLink}
      </div>
    </li>
  `;
};

const committees = document.querySelector("[data-committees]");
if (committees) {
  committees.innerHTML = conference.committees
    .map(
      (group) => `
    <article class="committee-card">
      <h3>${html(group.title)}</h3>
      <ul class="committee-members">
        ${group.members.map(memberMarkup).join("")}
      </ul>
    </article>
  `,
    )
    .join("");
}

/* ─── Sponsorship ─────────────────────────────────────────────────────────── */
const sponsorshipSummary = document.querySelector("[data-sponsorship-summary]");
if (sponsorshipSummary) {
  sponsorshipSummary.textContent = conference.sponsorship.intro[0];
}

const sponsorshipIntro = document.querySelector("[data-sponsorship-intro]");
if (sponsorshipIntro) {
  sponsorshipIntro.innerHTML = conference.sponsorship.intro
    .slice(1)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

const sponsorshipPackages = document.querySelector("[data-sponsorship-packages]");
if (sponsorshipPackages) {
  sponsorshipPackages.innerHTML = `
    <div class="package-row package-head" role="row">
      <div role="columnheader">Sponsorship grade</div>
      <div role="columnheader">Amount of contribution</div>
    </div>
    ${conference.sponsorship.packages
      .map(
        (item) => `
        <div class="package-row" role="row">
          <div role="cell">${item.grade}</div>
          <strong role="cell">${item.amount}</strong>
        </div>
      `,
      )
      .join("")}
  `;
}

text("[data-sponsorship-tax-note]", conference.sponsorship.taxNote);

const sponsorshipBenefits = document.querySelector("[data-sponsorship-benefits]");
if (sponsorshipBenefits) {
  sponsorshipBenefits.innerHTML = conference.sponsorship.benefits
    .map(
      (benefit) => `
      <article class="benefit-card">
        <div class="benefit-card-top">
          <h3>${benefit.title}</h3>
          <span>${benefit.amount}</span>
        </div>
        <ul>
          ${benefit.details.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
    `,
    )
    .join("");
}

const sponsorshipContact = document.querySelector("[data-sponsorship-contact]");
if (sponsorshipContact) {
  sponsorshipContact.innerHTML = `<strong>${conference.sponsorship.contact}</strong>`;
}

/* ─── Fellowship ──────────────────────────────────────────────────────────── */
text(
  "[data-travel-grants-description]",
  conference.fellowship.travelGrants.description,
);
text(
  "[data-travel-grants-instruction]",
  conference.fellowship.travelGrants.instruction,
);
text("[data-awards-description]", conference.fellowship.awards);

const travelGrantFields = document.querySelector("[data-travel-grant-fields]");
if (travelGrantFields) {
  travelGrantFields.innerHTML = conference.fellowship.travelGrants.fields
    .map((field) => `<li>${field}</li>`)
    .join("");
}

/* ─── Registration fees ────────────────────────────────────────────────────── */
const fees = document.querySelector("[data-registration-fees]");
const pricingCard = document.querySelector("[data-registration-pricing]");
const audienceLabel = document.querySelector("[data-registration-audience]");
const currencyButtons = document.querySelectorAll("[data-currency-toggle]");

const participantTypes = {
  inr: {
    label: "Indian Participant Fees",
    matcher: "indian participant",
  },
  usd: {
    label: "Foreign Participant Fees",
    matcher: "foreign participant",
  },
};

const feeGroups = [
  {
    title: "Students",
    description: "Reduced conference registration for enrolled students.",
    isMatch: (category) => category.includes("student"),
  },
  {
    title: "Regular",
    description: "Full conference registration for regular delegates.",
    isMatch: (category) => !category.includes("student"),
  },
];

const membershipOrder = [
  "IEEE Member",
  "IEEE Women Member",
  "Non-IEEE Member",
  "Non-IEEE Women Member",
];

let selectedCurrency = "inr";

const getRegistrationFee = (currency, group, membership) => {
  const participant = participantTypes[currency].matcher;

  return conference.registrationFees.find((fee) => {
    const category = fee.category.toLowerCase();
    return (
      fee.group === membership &&
      category.includes(participant) &&
      group.isMatch(category)
    );
  });
};

const renderRegistrationFees = () => {
  if (!fees) return;

  if (audienceLabel) {
    audienceLabel.textContent = participantTypes[selectedCurrency].label;
  }
  if (pricingCard) {
    pricingCard.dataset.currency = selectedCurrency;
  }

  fees.innerHTML = feeGroups
    .map((group, groupIndex) => {
      const rows = membershipOrder
        .map((membership) => {
          const fee = getRegistrationFee(selectedCurrency, group, membership);
          if (!fee) return "";

          return `
            <div class="pricing-row" role="row">
              <div class="pricing-membership" role="cell">${html(membership)}</div>
              <div class="pricing-price" role="cell" data-label="Early Bird">
                <span>Early Bird</span>
                <strong>${html(fee.earlyBird)}</strong>
              </div>
              <div class="pricing-price" role="cell" data-label="Late">
                <span>Late</span>
                <strong>${html(fee.late)}</strong>
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <section class="pricing-group" role="rowgroup" aria-labelledby="fee-group-${groupIndex}">
          <div class="pricing-group-heading">
            <span aria-hidden="true">${String(groupIndex + 1).padStart(2, "0")}</span>
            <div>
              <h4 id="fee-group-${groupIndex}">${html(group.title)}</h4>
              <p>${html(group.description)}</p>
            </div>
          </div>
          <div class="pricing-row pricing-row-head" role="row">
            <div role="columnheader">Membership</div>
            <div role="columnheader">Early Bird</div>
            <div role="columnheader">Late</div>
          </div>
          ${rows}
        </section>
      `;
    })
    .join("");
};

currencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextCurrency = button.dataset.currencyToggle;
    if (!nextCurrency || nextCurrency === selectedCurrency) return;

    selectedCurrency = nextCurrency;
    currencyButtons.forEach((item) => {
      item.setAttribute(
        "aria-pressed",
        String(item.dataset.currencyToggle === selectedCurrency),
      );
    });

    pricingCard?.classList.add("is-switching");
    window.setTimeout(() => {
      renderRegistrationFees();
      pricingCard?.classList.remove("is-switching");
    }, 120);
  });
});

renderRegistrationFees();

const authorNotes = document.querySelector("[data-author-notes]");
if (authorNotes) {
  authorNotes.innerHTML = conference.registrationGuidelines.authors
    .map((item) => `<li>${html(item)}</li>`)
    .join("");
}

const attendeeNotes = document.querySelector("[data-attendee-notes]");
if (attendeeNotes) {
  attendeeNotes.innerHTML = conference.registrationGuidelines.attendees
    .map((item) => `<li>${html(item)}</li>`)
    .join("");
}

/* ─── Contact ──────────────────────────────────────────────────────────────── */
const contactIcons = {
  "Organising Secretary": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  "Conference Email":     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  "Phone":                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  "Host Institute":       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
  "Location":             `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
};

const contact = document.querySelector("[data-contact]");
if (contact) {
  contact.innerHTML = conference.contact
    .map((item) => {
    const icon = contactIcons[item.label] || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
    const isEmail = item.label === "Conference Email";
    const valueHtml = isEmail
      ? `<strong><a href="mailto:${attr(item.value)}">${html(item.value)}</a></strong>`
      : `<strong>${html(item.value)}</strong>`;

    return `
      <article class="contact-card">
        <div class="contact-card-top">
          <div class="contact-card-icon" aria-hidden="true">${icon}</div>
          <span>${html(item.label)}</span>
        </div>
        <div class="contact-card-value">
          ${valueHtml}
        </div>
      </article>
    `;
    })
    .join("");
}

/* ─── Scroll progress + active nav ────────────────────────────────────────── */
const nav         = document.querySelector("[data-nav]");
const menuButton  = document.querySelector("[data-menu-button]");
const progressBar = document.getElementById("progress-bar");
const fabTop      = document.getElementById("fab-top");

const updateScrollState = () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;

  // Progress bar
  if (progressBar) {
    progressBar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : "0%";
  }

  // Floating back-to-top
  fabTop?.classList.toggle("is-visible", scrolled > 400);
};

let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      updateScrollState();
      updateActiveSection();
      scrollTicking = false;
    });
  },
  { passive: true },
);

// Back-to-top FAB
fabTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0 });
});

/* ─── Mobile menu ──────────────────────────────────────────────────────────── */
menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuButton.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

/* ─── In-page search ──────────────────────────────────────────────────────── */
const searchForm = document.querySelector("[data-site-search]");
const searchInput = document.querySelector("[data-search-input]");
const searchResults = document.querySelector("[data-search-results]");

const searchSections = Array.from(document.querySelectorAll("main section[id]")).map(
  (section) => {
    const heading = section.querySelector("h1, h2, h3")?.textContent?.trim() || section.id;
    const body = section.textContent.replace(/\s+/g, " ").trim();

    return {
      id: section.id,
      title: heading,
      content: `${heading} ${body}`.toLowerCase(),
    };
  },
);

const closeSearchResults = () => {
  if (!searchResults) return;
  searchResults.hidden = true;
  searchResults.innerHTML = "";
};

const goToSearchResult = (id) => {
  const section = document.getElementById(id);
  if (!section) return;

  section.scrollIntoView({ behavior: "smooth", block: "start" });
  closeSearchResults();
  searchInput.value = "";
  searchInput.blur();
};

const getSearchMatches = (query) => {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];

  return searchSections
    .filter((section) => section.content.includes(normalized))
    .slice(0, 6);
};

const renderSearchResults = () => {
  if (!searchInput || !searchResults) return;

  const matches = getSearchMatches(searchInput.value);
  if (!matches.length) {
    searchResults.innerHTML = searchInput.value.trim().length >= 2
      ? `<p>No matching sections found.</p>`
      : "";
    searchResults.hidden = searchResults.innerHTML === "";
    return;
  }

  searchResults.innerHTML = matches
    .map(
      (match) => `
      <button type="button" data-search-result="${attr(match.id)}">
        <span>${html(match.title)}</span>
      </button>
    `,
    )
    .join("");
  searchResults.hidden = false;
};

searchInput?.addEventListener("input", renderSearchResults);

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!searchForm.classList.contains("is-expanded")) {
    searchForm.classList.add("is-expanded");
    searchInput.focus();
    return;
  }
  const firstMatch = getSearchMatches(searchInput.value)[0];
  if (firstMatch) goToSearchResult(firstMatch.id);
});

searchResults?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-search-result]");
  if (!button) return;
  goToSearchResult(button.dataset.searchResult);
});

searchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSearchResults();
    if (searchInput.value.trim() === "") {
      searchForm.classList.remove("is-expanded");
    }
    searchInput.blur();
  }
});

document.addEventListener("click", (event) => {
  if (!searchForm?.contains(event.target)) {
    closeSearchResults();
    if (searchInput?.value.trim() === "") {
      searchForm?.classList.remove("is-expanded");
    }
  }
});

/* ─── Active nav link tracking ─────────────────────────────────────────────── */
const navItems = [
  "welcome",
  "announcements",
  "dates",
  "about",
  "scope",
  "call-for-papers",
  "tracks",
  "publication",
  "registration",
  "speakers",
  "committees",
  "sponsors",
  "venue",
  "downloads",
  "contact"
];

let activeSection = "";

const sections = navItems
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navLinks = document.querySelectorAll(".site-nav a[href^='#']");

const setActiveSection = (id) => {
  if (activeSection === id) return;

  activeSection = id;

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;

    link.classList.toggle("is-active", isActive);
  });
};

const updateActiveSection = () => {
  const scrollPosition = window.scrollY + 180;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;

    if (
      scrollPosition >= top &&
      scrollPosition < top + height
    ) {
      setActiveSection(section.id);
    }
  });
};

updateActiveSection();
updateScrollState();

/* ─── Dark mode removed ────────────────────────────────────────────────────── */

/* ─── Static homepage sections ─────────────────────────────────────────────── */
document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));

/* ── Tracks: dark cards matching reference design ───────────────────── */
.track-grid { grid-template-columns: 1fr !important; gap: 24px; }

.track-card {
  display: block;
  background: var(--brand-jet-black);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: clamp(22px, 3vw, 36px);
}

.track-card-header {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.track-pill-number {
  display: inline-flex;
  align-items: center;
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid var(--brand-soft-white);
  color: var(--brand-soft-white);
  font-weight: 700;
  font-size: 0.85rem;
}

.track-pill-title {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--brand-bold-blue), var(--brand-light-blue));
  color: var(--brand-soft-white);
  font-weight: 700;
  font-size: 0.9rem;
}

.track-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
}

.track-tag {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(250,250,250,0.35);
  color: var(--brand-soft-white);
  font-size: 0.78rem;
}

.track-body h3 {
  font-family: var(--font-heading);
  font-style: italic;
  color: var(--brand-light-blue);
  font-size: 1.2rem;
  margin: 0 0 10px;
}

.track-body p {
  color: rgba(250,250,250,0.85);
  margin: 0 0 16px;
  max-width: 760px;
}

.track-scope-list {
  list-style: none;
  margin: 0;
  padding: 0;
  color: rgba(250,250,250,0.8);
  transition: max-height 220ms ease, margin 220ms ease;
}

.track-scope-list[data-collapsed="true"] { max-height: 0; overflow: hidden; margin: 0; }
.track-scope-list[data-collapsed="false"] { max-height: 1000px; margin-bottom: 16px; }

.track-scope-list li {
  padding: 4px 0 4px 16px;
  position: relative;
  font-size: 0.92rem;
}

.track-scope-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.75em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--brand-light-blue);
}

.track-toggle {
  background: none;
  border: 1px solid var(--brand-light-blue);
  color: var(--brand-light-blue);
  padding: 8px 18px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

.track-toggle:hover { background: rgba(103,186,244,0.12); }
