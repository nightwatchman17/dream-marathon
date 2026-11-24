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
/* Dream Marathon 2026 starts on 11 December 2026, 00:00 Bangladesh time.
   Change RACE_START below when the exact start time is confirmed. */
const RACE_START = new Date("2026-12-11T00:00:00+06:00");
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

/* Slot availability ------------------------------------------------------ */
/* Update data-total / data-booked on .slots in index.html when numbers change. */
const slotsPanel = document.querySelector(".slots[data-total][data-booked]");

if (slotsPanel) {
  const total = Number(slotsPanel.dataset.total);
  const booked = Number(slotsPanel.dataset.booked);

  if (Number.isFinite(total) && total > 0 && Number.isFinite(booked) && booked >= 0) {
    const left = Math.max(total - booked, 0);
    const filled = Math.min(booked, total);
    const percent = Math.round((filled / total) * 100);

    const setText = (selector, value) => {
      const element = slotsPanel.querySelector(selector);
      if (element) element.textContent = value;
    };
    setText("[data-slots-total]", String(total));
    setText("[data-slots-booked]", String(booked));
    setText("[data-slots-left]", String(left));
    setText("[data-slots-percent]", `${percent}%`);

    const bar = slotsPanel.querySelector("[data-slots-bar]");
    if (bar) {
      bar.setAttribute("aria-valuemax", String(total));
      bar.setAttribute("aria-valuenow", String(filled));
      bar.setAttribute("aria-valuetext", `${filled} of ${total} slots booked, ${percent}% filled`);
    }
    const fill = slotsPanel.querySelector("[data-slots-fill]");
    if (fill) fill.style.width = `${Math.min(percent, 100)}%`;
  }
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

/* Registration closed ---------------------------------------------------- */
/* All registration calls to action share this dialog. No form links remain. */
const registrationDialogMarkup = `
<dialog class="registration-dialog" id="registration-dialog" aria-labelledby="registration-dialog-title" aria-describedby="registration-dialog-copy">
  <div class="registration-dialog__panel">
    <div class="registration-dialog__badge" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5zM12 15v2"/></svg>
    </div>
    <p class="registration-dialog__eyebrow">Dream Marathon 2026</p>
    <h2 id="registration-dialog-title">All slots are booked</h2>
    <p class="registration-dialog__copy" id="registration-dialog-copy">Registration is closed. All slots are booked. Thank you for the incredible response — follow the noticeboard for event updates.</p>
    <button class="registration-dialog__close" type="button" data-registration-dialog-close>Got it</button>
  </div>
</dialog>`;

if (!document.querySelector("#registration-dialog")) {
  document.body.insertAdjacentHTML("beforeend", registrationDialogMarkup);
}

const registrationDialog = document.querySelector("#registration-dialog");

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target || !registrationDialog) return;

  if (target.closest("[data-registration-closed]")) {
    event.preventDefault();
    if (!registrationDialog.open && typeof registrationDialog.showModal === "function") {
      registrationDialog.showModal();
    } else if (!registrationDialog.open) {
      window.alert("Registration is closed. All slots are booked.");
    }
    return;
  }

  if (target.closest("[data-registration-dialog-close]")) {
    registrationDialog.close();
    return;
  }

  if (target === registrationDialog) registrationDialog.close();
});
