const greetBtn = document.getElementById("greetBtn");
const message = document.getElementById("message");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactMessage = document.getElementById("contactMessage");
const submitToast = document.getElementById("submitToast");
const revealItems = document.querySelectorAll(".reveal");
const heroRole = document.getElementById("heroRole");
const profileRole = document.getElementById("profileRole");
const skillFills = document.querySelectorAll(".skill-fill");
const introLoader = document.getElementById("introLoader");

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
  window.addEventListener("load", () => {
    setTimeout(() => {
      introLoader.classList.add("is-hidden");
      document.body.classList.remove("loading");
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
      return;
    }

    snake.unshift(nextHead);

    if (nextHead.x === food.x && nextHead.y === food.y) {
      score += 1;
      snakeScore.textContent = String(score);
      snakeState.textContent = "Nice! Keep going.";
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
      restartSnake();
    });
  }

  restartSnake();
  gameLoopId = window.setInterval(tick, speedMs);
}
