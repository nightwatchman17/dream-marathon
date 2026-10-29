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
   adding files to the gallery folder). A thumbnail strip sits at the top and
   each photo is shown large, centered, one after another, keeping its ratio. */
const galleryStrip = document.querySelector("[data-gallery-strip]");
const galleryViewer = document.querySelector("[data-gallery-viewer]");
const galleryEmpty = document.querySelector("[data-gallery-empty]");
const galleryCount = document.querySelector("[data-gallery-count]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (galleryStrip && galleryViewer) {
  const photos = Array.isArray(window.DREAM_MARATHON_GALLERY) ? window.DREAM_MARATHON_GALLERY : [];
  const entries = photos.filter((photo) => photo && typeof photo.src === "string" && photo.src.trim());

  if (entries.length) {
    const thumbs = document.createDocumentFragment();
    const shots = document.createDocumentFragment();

    const updateCount = () => {
      const total = galleryViewer.querySelectorAll(".gallery-shot").length;
      if (galleryCount) {
        galleryCount.textContent = `${total} ${total === 1 ? "photo" : "photos"}`;
        galleryCount.hidden = total === 0;
      }
      if (total === 0) {
        galleryStrip.hidden = true;
        galleryViewer.hidden = true;
        if (galleryEmpty) galleryEmpty.hidden = false;
      }
    };

    const setActive = (id) => {
      const thumbnails = galleryStrip.querySelectorAll(".gallery-thumb");
      let activeThumb = null;
      thumbnails.forEach((thumb) => {
        const isActive = thumb.dataset.target === id;
        thumb.classList.toggle("is-active", isActive);
        if (isActive) {
          activeThumb = thumb;
          thumb.setAttribute("aria-current", "true");
        } else {
          thumb.removeAttribute("aria-current");
        }
      });
      if (activeThumb) {
        galleryStrip.scrollTo({
          left: activeThumb.offsetLeft - (galleryStrip.clientWidth - activeThumb.offsetWidth) / 2,
          behavior: reducedMotion.matches ? "auto" : "smooth",
        });
      }
    };

    entries.forEach((photo, index) => {
      const caption = typeof photo.caption === "string" && photo.caption.trim()
        ? photo.caption.trim()
        : `Dream Marathon Spirit photo ${index + 1}`;
      const number = String(index + 1).padStart(2, "0");
      const id = `gallery-photo-${index + 1}`;

      const shot = document.createElement("figure");
      shot.className = "gallery-shot";
      shot.id = id;

      const frame = document.createElement("div");
      frame.className = "gallery-shot-frame";

      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = caption;
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";

      frame.append(image);

      const captionRow = document.createElement("figcaption");
      captionRow.className = "gallery-shot-caption";
      const numberLabel = document.createElement("span");
      numberLabel.className = "gallery-shot-number";
      numberLabel.textContent = number;
      const captionText = document.createElement("span");
      captionText.textContent = caption;
      captionRow.append(numberLabel, captionText);

      shot.append(frame, captionRow);
      shots.append(shot);

      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "gallery-thumb";
      thumb.dataset.target = id;
      thumb.setAttribute("aria-label", `Show photo ${index + 1}: ${caption}`);

      const thumbImage = document.createElement("img");
      thumbImage.src = photo.src;
      thumbImage.alt = "";
      thumbImage.loading = "lazy";
      thumbImage.decoding = "async";
      thumb.append(thumbImage);

      thumb.addEventListener("click", () => {
        const target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({
          behavior: reducedMotion.matches ? "auto" : "smooth",
          block: "center",
        });
        setActive(id);
      });

      const removeEntry = () => {
        thumb.remove();
        shot.remove();
        updateCount();
        const first = galleryViewer.querySelector(".gallery-shot");
        if (first) setActive(first.id);
      };
      image.addEventListener("error", removeEntry);
      thumbImage.addEventListener("error", removeEntry);

      thumbs.append(thumb);
    });

    galleryStrip.append(thumbs);
    galleryViewer.append(shots);
    galleryStrip.hidden = false;
    galleryViewer.hidden = false;
    if (galleryEmpty) galleryEmpty.hidden = true;
    updateCount();

    setActive(entries.length ? "gallery-photo-1" : "");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((observed) => {
        observed.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

      galleryViewer.querySelectorAll(".gallery-shot").forEach((shot) => observer.observe(shot));
    }
  }
}
