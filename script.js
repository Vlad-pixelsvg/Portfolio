// ==========================================
// 1. EFFETTO TORCIA (SPOTLIGHT)
// ==========================================
document.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--x', e.clientX + 'px');
    document.body.style.setProperty('--y', e.clientY + 'px');
});

// ==========================================
// 2. SCROLL SPY (NAVIGAZIONE ATTIVA)
// ==========================================
const sections = document.querySelectorAll("section");
const navA = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navA.forEach((a) => {
        a.classList.remove("active");
        const href = a.getAttribute("href");
        if (href && current && href.includes(current)) {
            a.classList.add("active");
        }
    });
});

// ==========================================
// 3. CONTROLLO CAROSELLI (FRECCE AVANTI / INDIETRO)
// ==========================================
document.querySelectorAll('.carousel-section').forEach(section => {
    const track = section.querySelector('.carousel-track');
    const btnPrev = section.querySelector('.btn-prev');
    const btnNext = section.querySelector('.btn-next');

    if (track && btnPrev && btnNext) {
        const getScrollAmount = () => {
            const slide = track.querySelector('.carousel-slide');
            return slide ? slide.offsetWidth + 20 : 300; // Larghezza della card + gap
        };

        btnNext.addEventListener('click', () => {
            track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        btnPrev.addEventListener('click', () => {
            track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
    }
});
