(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("open", open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    }));
  }

  document.querySelectorAll("[data-carousel]").forEach(carousel => {
    const track = carousel.querySelector("[data-track]");
    const prev = carousel.querySelector("[data-prev]");
    const next = carousel.querySelector("[data-next]");
    const count = carousel.querySelector("[data-count]");
    const status = carousel.querySelector("[data-carousel-status]");
    const cards = () => [...track.querySelectorAll("article:not([hidden])")];

    function update(announce = false) {
      const visible = cards();
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= maxScroll - 2;
      if (count) {
        const current = visible.length ? Math.min(visible.length, Math.floor((track.scrollLeft + 8) / Math.max(1, visible[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0))) + 1) : 0;
        count.textContent = `${String(current).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
      }
      if (announce && status) status.textContent = "Carosello aggiornato. Usa le frecce per spostarti tra i progetti.";
    }
    function move(direction) {
      const visible = cards();
      if (!visible.length) return;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const amount = visible[0].getBoundingClientRect().width + gap;
      track.scrollBy({ left: direction * amount, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      window.setTimeout(() => update(true), 220);
    }
    prev?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));
    track.addEventListener("scroll", () => update(false), { passive: true });
    window.addEventListener("resize", () => update(false));
    update();
  });

  const filters = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll(".project-card[data-category]")];
  filters.forEach(button => button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    cards.forEach(card => {
      card.hidden = selected !== "tutti" && !card.dataset.category.split(" ").includes(selected);
    });
    const carousel = document.querySelector("#progetti [data-track]");
    if (carousel) carousel.scrollTo({ left: 0, behavior: "auto" });
    const shell = document.querySelector("#progetti [data-carousel]");
    if (shell) {
      const count = shell.querySelector("[data-count]");
      const visible = cards.filter(card => !card.hidden).length;
      if (count) count.textContent = `${visible ? "01" : "00"} / ${String(visible).padStart(2, "0")}`;
    }
  }));

  const form = document.querySelector("#contact-form");
  if (form) form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const to = "inserisci-email@example.com";
    const subject = encodeURIComponent("Contatto portfolio");
    const body = encodeURIComponent(`Nome: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`);
    if (to.includes("inserisci-email")) {
      document.querySelector("#form-status").textContent = "Sostituisci inserisci-email@example.com nel file js/main.js con il tuo indirizzo prima di usare il modulo.";
      return;
    }
    location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
})();
