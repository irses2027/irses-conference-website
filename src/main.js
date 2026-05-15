import { conference } from "./data/conference.js";

const text = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

text("[data-event-label]", conference.label);
text("[data-event-title]", conference.title);
text("[data-event-theme]", conference.theme);
text("[data-event-dates]", conference.dates);
text("[data-event-venue]", conference.venue);
text("[data-event-host]", conference.host);
text("[data-event-description]", conference.description);
text("[data-event-purpose]", conference.purpose);
text("[data-registration-note]", conference.registrationNote);
text("[data-venue-title]", conference.venueDetails.title);
text("[data-venue-description]", conference.venueDetails.description);
text("[data-footer-copy]", conference.footer);

const dates = document.querySelector("[data-important-dates]");
dates.innerHTML = conference.importantDates
  .map(
    (item) => `
      <article class="date-card">
        <p>${item.label}</p>
        <strong>${item.date}</strong>
        <span>${item.note}</span>
      </article>
    `,
  )
  .join("");

const tracks = document.querySelector("[data-tracks]");
tracks.innerHTML = conference.tracks
  .map(
    (track, index) => `
      <article class="track-card">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <h3>${track}</h3>
      </article>
    `,
  )
  .join("");

const committees = document.querySelector("[data-committees]");
committees.innerHTML = conference.committees
  .map(
    (group) => `
      <article class="committee-card">
        <h3>${group.title}</h3>
        <ul>
          ${group.members.map((member) => `<li>${member}</li>`).join("")}
        </ul>
      </article>
    `,
  )
  .join("");

const fees = document.querySelector("[data-registration-fees]");
fees.innerHTML = conference.registrationFees
  .map(
    (fee) => `
      <tr>
        <td>${fee.category}</td>
        <td>${fee.early}</td>
        <td>${fee.regular}</td>
      </tr>
    `,
  )
  .join("");

const contact = document.querySelector("[data-contact]");
contact.innerHTML = conference.contact
  .map(
    (item) => `
      <article class="contact-card">
        <span>${item.label}</span>
        <strong>${item.value}</strong>
      </article>
    `,
  )
  .join("");

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
});

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) nav.classList.remove("is-open");
});
