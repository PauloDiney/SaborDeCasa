document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".carousel_slide");
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? "block" : "none";
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    // Inicializa o carrossel
    showSlide(currentIndex);
    setInterval(nextSlide, 3000); // Troca de slide a cada 3 segundos
});