/* Shared behaviour for the Dream Marathon Spirit site. */

/* Mobile navigation ------------------------------------------------------- */
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement && window.matchMedia("(max-width: 680px)").matches) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navigation.classList.contains("is-open")) return;
    if (navigation.contains(event.target) || menuToggle.contains(event.target)) return;
    closeMenu();
  });
}

/* Countdown --------------------------------------------------------------- */
/* Dream Marathon 1.0 starts on 4 December 2026, 00:00 Bangladesh time.
   Change RACE_START below when the exact start time is confirmed. */
const RACE_START = new Date("2026-12-04T00:00:00+06:00");
const countdown = document.querySelector("#race-countdown");

if (countdown) {
  const units = {
    days: countdown.querySelector('[data-unit="days"]'),
    hours: countdown.querySelector('[data-unit="hours"]'),
    minutes: countdown.querySelector('[data-unit="minutes"]'),
    seconds: countdown.querySelector('[data-unit="seconds"]'),
  };
  const note = document.querySelector("[data-countdown-note]");
  const pad = (value) => String(value).padStart(2, "0");

  const tick = () => {
    const remaining = Math.max(RACE_START.getTime() - Date.now(), 0);
    const totalSeconds = Math.floor(remaining / 1000);

    units.days.textContent = pad(Math.floor(totalSeconds / 86400));
    units.hours.textContent = pad(Math.floor(totalSeconds / 3600) % 24);
    units.minutes.textContent = pad(Math.floor(totalSeconds / 60) % 60);
    units.seconds.textContent = pad(totalSeconds % 60);

    const arrived = remaining === 0;
    countdown.closest(".countdown").dataset.arrived = String(arrived);
    if (note) note.textContent = arrived ? "Race day is here" : "The countdown is on";
  };

  tick();
  setInterval(tick, 1000);
}

/* Gallery ----------------------------------------------------------------- */
/* Photos come from gallery/photos.js (run scripts/build-gallery.mjs after
   adding files to the gallery folder). Images keep their natural ratio. */
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryEmpty = document.querySelector("[data-gallery-empty]");
const galleryCount = document.querySelector("[data-gallery-count]");

if (galleryGrid) {
  const photos = Array.isArray(window.DREAM_MARATHON_GALLERY) ? window.DREAM_MARATHON_GALLERY : [];
  const entries = photos.filter((photo) => photo && typeof photo.src === "string" && photo.src.trim());

  if (entries.length) {
    const fragment = document.createDocumentFragment();

    entries.forEach((photo, index) => {
      const caption = typeof photo.caption === "string" && photo.caption.trim()
        ? photo.caption.trim()
        : `Dream Marathon Spirit photo ${index + 1}`;

      const card = document.createElement("figure");
      card.className = "gallery-card";

      const media = document.createElement("div");
      media.className = "gallery-media";

      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = caption;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        card.remove();
        if (!galleryGrid.querySelector(".gallery-card") && galleryEmpty) {
          galleryGrid.hidden = true;
          galleryEmpty.hidden = false;
        }
      });

      media.append(image);

      const captionRow = document.createElement("figcaption");
      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");
      const label = document.createElement("span");
      label.textContent = caption;
      captionRow.append(number, label);

      card.append(media, captionRow);
      fragment.append(card);
    });

    galleryGrid.append(fragment);
    galleryGrid.hidden = false;
    if (galleryEmpty) galleryEmpty.hidden = true;
    if (galleryCount) {
      galleryCount.textContent = `${entries.length} ${entries.length === 1 ? "photo" : "photos"}`;
      galleryCount.hidden = false;
    }
  }
}
