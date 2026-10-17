document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-indicators');
    const statusAnnouncer = document.getElementById('carousel-status');

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Estrai i titoli dei progetti per gli annunci vocali
    const slideTitles = slides.map(slide => {
        const titleEl = slide.querySelector('h3');
        return titleEl ? titleEl.textContent : `Progetto ${slides.indexOf(slide) + 1}`;
    });

    // Crea dinamicamente i pallini indicatori accessibili
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('indicator-dot');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        dot.setAttribute('aria-label', `Vai al progetto ${index + 1}: ${slideTitles[index]}`);
        dot.addEventListener('click', () => {
            moveToSlide(index);
            updateControlFocus(dot);
        });
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    // Funzione principale per spostare il carosello
    const moveToSlide = (targetIndex) => {
        if (targetIndex < 0) {
            targetIndex = totalSlides - 1; // Loop circolare opzionale
        } else if (targetIndex >= totalSlides) {
            targetIndex = 0;
        }

        currentIndex = targetIndex;
        const amountToMove = slides[currentIndex].getBoundingClientRect().width;
        
        // Spostamento orizzontale della track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Aggiorna classi visive e attributi ARIA per le slide
        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('is-selected');
                slide.removeAttribute('aria-hidden');
            } else {
                slide.classList.remove('is-selected');
                slide.setAttribute('aria-hidden', 'true');
            }
        });

        // Aggiorna gli indicatori (tablist)
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.setAttribute('aria-selected', 'false');
            }
        });

        // Annuncio dinamico per screen reader (aria-live)
        if (statusAnnouncer) {
            statusAnnouncer.textContent = `Progetto ${currentIndex + 1} di ${totalSlides}: ${slideTitles[currentIndex]}`;
        }
    };

    // Gestione focus dei bottoni indicatori
    const updateControlFocus = (element) => {
        element.focus();
    };

    // Event Listener Pulsanti Avanti / Indietro
    nextButton.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
    });

    // Supporto per navigazione tramite tastiera (Freccia Sinistra / Freccia Destra) all'interno del carosello
    const carouselRegion = document.querySelector('.carousel-container');
    carouselRegion.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            moveToSlide(currentIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            moveToSlide(currentIndex - 1);
        }
    });

    // Inizializzazione iniziale attributi aria-hidden sulle slide non attive
    slides.forEach((slide, idx) => {
        if (idx !== 0) {
            slide.setAttribute('aria-hidden', 'true');
        }
    });
});
