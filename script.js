(() => {
  "use strict";

  const CONFIG = {
    password: "0226",
    birthday: { year: 2026, month: 8, day: 2 }, // month is zero-based
    calendarStart: { year: 2026, month: 7, day: 18 }
  };

  const $ = (selector) => document.querySelector(selector);
  const lockScreen = $("#lockScreen");
  const countdownScreen = $("#countdownScreen");
  const birthdayScreen = $("#birthdayScreen");
  const unlockForm = $("#unlockForm");
  const passwordInput = $("#password");
  const passwordError = $("#passwordError");
  const music = $("#backgroundMusic");

  let timerId = null;
  let unlocked = false;

  function localDateAtMidnight(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function birthdayStart() {
    return new Date(CONFIG.birthday.year, CONFIG.birthday.month, CONFIG.birthday.day);
  }

  function isBirthdayAvailable(now = new Date()) {
    return now >= birthdayStart();
  }

  function renderCalendar(now = new Date()) {
    const grid = $("#calendarGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const start = new Date(CONFIG.calendarStart.year, CONFIG.calendarStart.month, CONFIG.calendarStart.day);
    const end = birthdayStart();
    const today = localDateAtMidnight(now);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const item = document.createElement("article");
      const day = date.getDate();
      const completed = date < today;
      const current = date.getTime() === today.getTime();
      const special = date.getTime() === end.getTime();

      item.className = "day-card" +
        (completed ? " completed" : "") +
        (current ? " current" : "") +
        (special ? " special" : "");

      item.innerHTML = `
        <span class="day-number">${day === 2 && special ? "♥" : day}</span>
        <span class="day-label">${date.toLocaleDateString(undefined, { weekday: "short", month: "short" })}${special ? " · Your day" : ""}</span>
      `;
      grid.appendChild(item);
    }
  }

  function updateCountdown() {
    const now = new Date();

    if (isBirthdayAvailable(now)) {
      showBirthday();
      return;
    }

    const target = birthdayStart();
    let diff = target - now;
    if (diff < 0) diff = 0;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    $("#days").textContent = String(days).padStart(2, "0");
    $("#hours").textContent = String(hours).padStart(2, "0");
    $("#minutes").textContent = String(minutes).padStart(2, "0");
    $("#seconds").textContent = String(seconds).padStart(2, "0");

    renderCalendar(now);
  }

  function showBirthday() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    countdownScreen.classList.add("hidden");
    birthdayScreen.classList.remove("hidden");
    document.title = "Happy Birthday, Purva ❤️";
    launchConfetti();
  }

  function startCountdown() {
    updateCountdown();
    if (!isBirthdayAvailable()) {
      timerId = window.setInterval(updateCountdown, 1000);
    }
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    lockScreen.classList.add("unlocking");

    window.setTimeout(() => {
      lockScreen.classList.add("hidden");
      if (isBirthdayAvailable()) {
        showBirthday();
      } else {
        countdownScreen.classList.remove("hidden");
        startCountdown();
      }
    }, 700);
  }

  unlockForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (passwordInput.value === CONFIG.password) {
      passwordError.textContent = "";
      unlock();
    } else {
      passwordError.textContent = "Hmm... that's not the secret I was looking for ❤️";
      passwordInput.classList.remove("shake");
      void passwordInput.offsetWidth;
      passwordInput.classList.add("shake");
      passwordInput.select();
    }
  });

  function launchConfetti() {
    const layer = $("#confetti");
    if (!layer || layer.dataset.launched) return;
    layer.dataset.launched = "true";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 90; i++) {
      const piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.setProperty("--drift", `${(Math.random() - .5) * 220}px`);
      piece.style.setProperty("--fall", `${2.8 + Math.random() * 3.5}s`);
      piece.style.animationDelay = `${Math.random() * .8}s`;
      fragment.appendChild(piece);
    }
    layer.appendChild(fragment);
    window.setTimeout(() => { layer.innerHTML = ""; }, 7000);
  }

  function setupGallery() {
    document.querySelectorAll(".photo-card").forEach((card) => {
      const src = card.dataset.image;
      const placeholder = card.querySelector(".photo-placeholder");

      const img = new Image();
      img.onload = () => {
        placeholder.style.backgroundImage = `url("${src}")`;
        card.classList.add("has-image");
      };
      img.onerror = () => {};
      img.src = src;

      card.addEventListener("click", () => {
        if (!card.classList.contains("has-image")) return;
        $("#lightboxImage").src = src;
        $("#lightboxImage").alt = card.dataset.caption || "Memory";
        $("#lightboxCaption").textContent = card.dataset.caption || "";
        $("#lightbox").classList.remove("hidden");
      });
    });

    $("#closeLightbox").addEventListener("click", closeLightbox);
    $("#lightbox").addEventListener("click", (event) => {
      if (event.target.id === "lightbox") closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });
  }

  function closeLightbox() {
    $("#lightbox").classList.add("hidden");
    $("#lightboxImage").src = "";
  }

  function setupMusic() {
    const buttons = [$("#musicButton"), $("#birthdayMusicButton")].filter(Boolean);

    const toggle = async () => {
      if (music.paused) {
        try {
          await music.play();
          buttons.forEach(btn => btn.textContent = "❚❚");
        } catch {
          buttons.forEach(btn => btn.textContent = "♫");
        }
      } else {
        music.pause();
        buttons.forEach(btn => btn.textContent = "♫");
      }
    };

    buttons.forEach(btn => btn.addEventListener("click", toggle));
    music.addEventListener("ended", () => buttons.forEach(btn => btn.textContent = "♫"));
  }

  setupGallery();
  setupMusic();
})();
