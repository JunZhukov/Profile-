const greetBtn = document.getElementById("greetBtn");
const message = document.getElementById("message");
const customCursor = document.getElementById("customCursor");
const customCursorDot = document.getElementById("customCursorDot");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactMessage = document.getElementById("contactMessage");
const submitToast = document.getElementById("submitToast");
const revealItems = document.querySelectorAll(".reveal");
const navItems = document.querySelectorAll(".top-nav .nav-item");
const heroRole = document.getElementById("heroRole");
const profileRole = document.getElementById("profileRole");
const skillFills = document.querySelectorAll(".skill-fill");
const introLoader = document.getElementById("introLoader");
const appleGreetingText = "Welcome to my profile!";
const WELCOME_WOOSH_SRC = "woosh.mp3";
const NAV_HOVER_SFX_SRC = "nav-hover.mp3";
const NAV_CLICK_SFX_SRC = "nav-click.mp3";
const SNAKE_START_SFX_SRC = "snake-start.mp3";
const SNAKE_EAT_SFX_SRC = "snake-eat.mp3";
const SNAKE_GAMEOVER_SFX_SRC = "snake-gameover.mp3";
const SNAKE_RESTART_SFX_SRC = "snake-restart.mp3";
const welcomeWoosh = new Audio(WELCOME_WOOSH_SRC);
const navHoverSfx = new Audio(NAV_HOVER_SFX_SRC);
const navClickSfx = new Audio(NAV_CLICK_SFX_SRC);
const snakeStartSfx = new Audio(SNAKE_START_SFX_SRC);
const snakeEatSfx = new Audio(SNAKE_EAT_SFX_SRC);
const snakeGameOverSfx = new Audio(SNAKE_GAMEOVER_SFX_SRC);
const snakeRestartSfx = new Audio(SNAKE_RESTART_SFX_SRC);
welcomeWoosh.preload = "auto";
navHoverSfx.preload = "auto";
navClickSfx.preload = "auto";
snakeStartSfx.preload = "auto";
snakeEatSfx.preload = "auto";
snakeGameOverSfx.preload = "auto";
snakeRestartSfx.preload = "auto";
navHoverSfx.volume = 0.55;
snakeStartSfx.volume = 0.6;
snakeEatSfx.volume = 0.65;
snakeGameOverSfx.volume = 0.75;
snakeRestartSfx.volume = 0.65;

const playSfx = (audio) => {
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Ignore if audio file is missing or playback is blocked.
  });
};

if (customCursor && customCursorDot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.body.classList.add("cursor-enabled");

  const showCursor = () => {
    customCursor.classList.add("visible");
    customCursorDot.classList.add("visible");
  };

  const hideCursor = () => {
    customCursor.classList.remove("visible");
    customCursorDot.classList.remove("visible");
  };

  document.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    customCursor.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
    customCursorDot.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
    showCursor();
  });

  document.addEventListener("mouseleave", hideCursor);
  document.addEventListener("mouseenter", showCursor);

  document.addEventListener("mouseover", (event) => {
    const interactive = event.target.closest("a, button, input, textarea, select, label, summary");
    customCursor.classList.toggle("active", Boolean(interactive));
  });
}

function isLikelyValidEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  if (!basicEmailPattern.test(normalizedEmail)) {
    return false;
  }

  const [, domain = ""] = normalizedEmail.split("@");
  const domainParts = domain.split(".");

  if (domain.includes("..") || domainParts.length < 2) {
    return false;
  }

  const hasInvalidDomainPart = domainParts.some(
    (part) => !part || part.startsWith("-") || part.endsWith("-")
  );
  if (hasInvalidDomainPart) {
    return false;
  }

  const blockedDomains = new Set([
    "example.com",
    "test.com",
    "fake.com",
    "tempmail.com",
    "mailinator.com",
    "guerrillamail.com"
  ]);

  return !blockedDomains.has(domain);
}

if (introLoader) {
  const showSetupGreeting = () => {
    const greetingOverlay = document.createElement("div");
    greetingOverlay.className = "setup-greeting";
    greetingOverlay.setAttribute("role", "status");
    greetingOverlay.setAttribute("aria-live", "polite");
    greetingOverlay.innerHTML = `
      <p class="setup-greeting-title">${appleGreetingText}</p>
    `;
    document.body.appendChild(greetingOverlay);

    requestAnimationFrame(() => {
      greetingOverlay.classList.add("show");
    });

    window.setTimeout(() => {
      welcomeWoosh.currentTime = 0;
      welcomeWoosh.play().catch(() => {
        // Ignore if sound is blocked or file is missing.
      });
      greetingOverlay.classList.remove("show");
      greetingOverlay.classList.add("hide");
      window.dispatchEvent(new Event("portfolio:welcome-finished"));
    }, 2200);

    window.setTimeout(() => {
      greetingOverlay.remove();
    }, 3100);
  };

  window.addEventListener("load", () => {
    setTimeout(() => {
      introLoader.classList.add("is-hidden");
      document.body.classList.remove("loading");
      showSetupGreeting();
    }, 3200);
  });
}

if (greetBtn && message && contactName && contactEmail && contactMessage) {
  greetBtn.addEventListener("click", () => {
    const senderName = contactName.value.trim();
    const senderEmail = contactEmail.value.trim();
    const senderMessage = contactMessage.value.trim();

    if (!senderName || !senderEmail || !senderMessage) {
      message.textContent = "Please complete all fields before sending.";
      return;
    }

    if (!isLikelyValidEmail(senderEmail)) {
      message.textContent = "Please enter a valid email address.";
      return;
    }

    const recipient = "charleslandonrodas@gmail.com";
    const subject = encodeURIComponent(`Portfolio message from ${senderName}`);
    const body = encodeURIComponent(
      `Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${senderMessage}`
    );

    if (submitToast) {
      submitToast.classList.remove("show");
      // Restart animation when user submits multiple times.
      void submitToast.offsetWidth;
      submitToast.classList.add("show");
    }

    message.textContent = "Opening your email app...";
    setTimeout(() => {
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    }, 700);
  });
}

if (navItems.length > 0) {
  navItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      playSfx(navHoverSfx);
    });
  });
}

document.addEventListener("click", () => {
  playSfx(navClickSfx);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (entry.target.id === "skills") {
          skillFills.forEach((bar) => {
            const level = Number(bar.dataset.level) || 0;
            bar.style.width = `${Math.min(Math.max(level, 0), 100)}%`;
          });
        }
      } else {
        entry.target.classList.remove("visible");
      }

    });
  },
  {
    threshold: 0.25
  }
);

revealItems.forEach((item) => observer.observe(item));

const roleItems = [
  { hero: "STUDENT", profile: "Student" },
  { hero: "WEB DESIGNER", profile: "Web Designer" },
  { hero: "GYMRAT", profile: "Gymrat" },
  { hero: "PREACHER", profile: "Preacher" }
];

if (heroRole && profileRole) {
  let roleIndex = 0;
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roleItems.length;
    heroRole.classList.add("fade-out");
    profileRole.classList.add("fade-out");

    setTimeout(() => {
      heroRole.textContent = roleItems[roleIndex].hero;
      profileRole.textContent = roleItems[roleIndex].profile;
      heroRole.classList.remove("fade-out");
      profileRole.classList.remove("fade-out");
    }, 220);
  }, 2600);
}

const snakeCanvas = document.getElementById("snakeCanvas");
const snakeScore = document.getElementById("snakeScore");
const snakeState = document.getElementById("snakeState");
const snakeRestartBtn = document.getElementById("snakeRestartBtn");
const funTrigger = document.getElementById("funTrigger");
const funModal = document.getElementById("funModal");
const funCloseBtn = document.getElementById("funCloseBtn");
const settingsTrigger = document.getElementById("settingsTrigger");
const settingsModal = document.getElementById("settingsModal");
const settingsCloseBtn = document.getElementById("settingsCloseBtn");
const themeToggle = document.getElementById("themeToggle");
const musicVolume = document.getElementById("musicVolume");
const musicVolumeValue = document.getElementById("musicVolumeValue");
const bgMusicPlayer = document.getElementById("bgMusicPlayer");
const musicPlayPauseBtn = document.getElementById("musicPlayPauseBtn");
const musicSeekBar = document.getElementById("musicSeekBar");
const musicCurrentTime = document.getElementById("musicCurrentTime");
const musicDuration = document.getElementById("musicDuration");
const THEME_STORAGE_KEY = "portfolio-theme";
const MUSIC_VOLUME_STORAGE_KEY = "portfolio-music-volume";
const BACKGROUND_MUSIC_SRC = "bg-music.mp3";

const tryAutoplayBackgroundMusic = () => {
  if (!bgMusicPlayer) return;

  const attemptPlayback = () => {
    bgMusicPlayer.play().catch(() => {
      // Some browsers block autoplay with sound until user interaction.
    });
  };

  attemptPlayback();

  const resumeOnFirstInteraction = () => {
    attemptPlayback();
    window.removeEventListener("pointerdown", resumeOnFirstInteraction);
    window.removeEventListener("keydown", resumeOnFirstInteraction);
    window.removeEventListener("touchstart", resumeOnFirstInteraction);
  };

  window.addEventListener("pointerdown", resumeOnFirstInteraction, { once: true });
  window.addEventListener("keydown", resumeOnFirstInteraction, { once: true });
  window.addEventListener("touchstart", resumeOnFirstInteraction, { once: true });
};

const formatTime = (seconds) => {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const applyTheme = (theme) => {
  const activeTheme = theme === "light" ? "light" : "dark";
  document.body.classList.toggle("theme-light", activeTheme === "light");
  if (themeToggle) {
    themeToggle.checked = activeTheme === "light";
  }
  localStorage.setItem(THEME_STORAGE_KEY, activeTheme);
};

applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || "dark");

if (settingsTrigger && settingsModal) {
  const openSettingsModal = () => {
    settingsModal.classList.add("open");
    settingsModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeSettingsModal = () => {
    settingsModal.classList.remove("open");
    settingsModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  settingsTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    openSettingsModal();
  });

  if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener("click", closeSettingsModal);
  }

  settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      closeSettingsModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && settingsModal.classList.contains("open")) {
      closeSettingsModal();
    }
  });
}

if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    applyTheme(themeToggle.checked ? "light" : "dark");
  });
}

if (bgMusicPlayer) {
  bgMusicPlayer.src = BACKGROUND_MUSIC_SRC;
  const storedVolume = Number(localStorage.getItem(MUSIC_VOLUME_STORAGE_KEY));
  const safeVolume = Number.isFinite(storedVolume)
    ? Math.min(Math.max(storedVolume, 0), 1)
    : 0.05;

  bgMusicPlayer.volume = safeVolume;
  if (musicVolume) {
    musicVolume.value = String(Math.round(safeVolume * 100));
  }
  if (musicVolumeValue) {
    musicVolumeValue.textContent = `${Math.round(safeVolume * 100)}%`;
  }

  window.addEventListener("portfolio:welcome-finished", tryAutoplayBackgroundMusic, { once: true });

  if (!introLoader) {
    if (document.readyState === "complete") {
      tryAutoplayBackgroundMusic();
    } else {
      window.addEventListener("load", tryAutoplayBackgroundMusic, { once: true });
    }
  }

  bgMusicPlayer.addEventListener("loadedmetadata", () => {
    if (musicDuration) {
      musicDuration.textContent = formatTime(bgMusicPlayer.duration);
    }
  });

  bgMusicPlayer.addEventListener("timeupdate", () => {
    if (musicCurrentTime) {
      musicCurrentTime.textContent = formatTime(bgMusicPlayer.currentTime);
    }
    if (musicSeekBar && bgMusicPlayer.duration) {
      musicSeekBar.value = String((bgMusicPlayer.currentTime / bgMusicPlayer.duration) * 100);
    }
  });

  bgMusicPlayer.addEventListener("play", () => {
    if (musicPlayPauseBtn) {
      musicPlayPauseBtn.textContent = "❚❚";
    }
  });

  bgMusicPlayer.addEventListener("pause", () => {
    if (musicPlayPauseBtn) {
      musicPlayPauseBtn.textContent = "▶";
    }
  });
}

if (musicVolume && bgMusicPlayer) {
  musicVolume.addEventListener("input", () => {
    const nextVolume = (Number(musicVolume.value) || 0) / 100;
    bgMusicPlayer.volume = Math.min(Math.max(nextVolume, 0), 1);
    localStorage.setItem(MUSIC_VOLUME_STORAGE_KEY, String(bgMusicPlayer.volume));
    if (musicVolumeValue) {
      musicVolumeValue.textContent = `${Math.round(bgMusicPlayer.volume * 100)}%`;
    }
  });
}

if (musicPlayPauseBtn && bgMusicPlayer) {
  musicPlayPauseBtn.addEventListener("click", () => {
    if (bgMusicPlayer.paused) {
      bgMusicPlayer.play().catch(() => {
        // Ignore blocked playback.
      });
    } else {
      bgMusicPlayer.pause();
    }
  });
}

if (musicSeekBar && bgMusicPlayer) {
  musicSeekBar.addEventListener("input", () => {
    if (!bgMusicPlayer.duration) return;
    const progress = (Number(musicSeekBar.value) || 0) / 100;
    bgMusicPlayer.currentTime = progress * bgMusicPlayer.duration;
  });
}

if (funTrigger && funModal) {
  const openFunModal = () => {
    funModal.classList.add("open");
    funModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeFunModal = () => {
    funModal.classList.remove("open");
    funModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  funTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    openFunModal();
  });

  if (funCloseBtn) {
    funCloseBtn.addEventListener("click", closeFunModal);
  }

  funModal.addEventListener("click", (event) => {
    if (event.target === funModal) {
      closeFunModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && funModal.classList.contains("open")) {
      closeFunModal();
    }
  });
}

if (snakeCanvas && snakeScore && snakeState) {
  const ctx = snakeCanvas.getContext("2d");
  const gridSize = 18;
  const tileCount = snakeCanvas.width / gridSize;
  const speedMs = 95;
  const directionMap = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };
  const oppositeMap = {
    up: "down",
    down: "up",
    left: "right",
    right: "left"
  };

  let snake = [];
  let food = { x: 8, y: 8 };
  let direction = "right";
  let pendingDirection = "right";
  let gameStarted = false;
  let gameOver = false;
  let score = 0;
  let gameLoopId;

  const drawCell = (x, y, color) => {
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize + 1, y * gridSize + 1, gridSize - 2, gridSize - 2);
  };

  const drawBoard = () => {
    if (!ctx) return;
    ctx.fillStyle = "#0d0d12";
    ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    for (let i = 0; i < snake.length; i += 1) {
      const part = snake[i];
      drawCell(part.x, part.y, i === 0 ? "#ff935f" : "#f86a36");
    }

    drawCell(food.x, food.y, "#f5f5f7");
  };

  const randomFood = () => {
    let nextFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    while (snake.some((part) => part.x === nextFood.x && part.y === nextFood.y)) {
      nextFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    }
    return nextFood;
  };

  const restartSnake = () => {
    snake = [
      { x: 5, y: 9 },
      { x: 4, y: 9 },
      { x: 3, y: 9 }
    ];
    direction = "right";
    pendingDirection = "right";
    food = randomFood();
    score = 0;
    gameStarted = false;
    gameOver = false;
    snakeScore.textContent = String(score);
    snakeState.textContent = "Press any arrow key to start.";
    drawBoard();
  };

  const setDirection = (nextDirection) => {
    if (!directionMap[nextDirection]) return;
    if (!gameStarted) {
      gameStarted = true;
      snakeState.textContent = "Game on.";
      playSfx(snakeStartSfx);
    }
    if (oppositeMap[direction] === nextDirection) return;
    pendingDirection = nextDirection;
  };

  const tick = () => {
    if (gameOver) return;
    if (!gameStarted) {
      drawBoard();
      return;
    }

    direction = pendingDirection;
    const head = snake[0];
    const nextHead = {
      x: head.x + directionMap[direction].x,
      y: head.y + directionMap[direction].y
    };

    const hitWall =
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= tileCount ||
      nextHead.y >= tileCount;
    const hitSelf = snake.some(
      (part) => part.x === nextHead.x && part.y === nextHead.y
    );

    if (hitWall || hitSelf) {
      gameOver = true;
      snakeState.textContent = "Game over. Press Restart.";
      playSfx(snakeGameOverSfx);
      return;
    }

    snake.unshift(nextHead);

    if (nextHead.x === food.x && nextHead.y === food.y) {
      score += 1;
      snakeScore.textContent = String(score);
      snakeState.textContent = "Nice! Keep going.";
      playSfx(snakeEatSfx);
      food = randomFood();
    } else {
      snake.pop();
    }

    drawBoard();
  };

  const keyToDirection = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
  };

  document.addEventListener("keydown", (event) => {
    if (funModal && !funModal.classList.contains("open")) return;
    const targetTag = event.target && event.target.tagName;
    if (targetTag === "INPUT" || targetTag === "TEXTAREA") return;
    const nextDirection = keyToDirection[event.key];
    if (!nextDirection) return;
    event.preventDefault();
    setDirection(nextDirection);
  });

  if (snakeRestartBtn) {
    snakeRestartBtn.addEventListener("click", () => {
      playSfx(snakeRestartSfx);
      restartSnake();
    });
  }

  restartSnake();
  gameLoopId = window.setInterval(tick, speedMs);
}
