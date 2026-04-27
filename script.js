const greetBtn = document.getElementById("greetBtn");
const message = document.getElementById("message");
const revealItems = document.querySelectorAll(".reveal");
const heroRole = document.getElementById("heroRole");
const profileRole = document.getElementById("profileRole");

if (greetBtn && message) {
  greetBtn.addEventListener("click", () => {
    message.textContent = "Message sent. I will get back to you soon!";
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
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
