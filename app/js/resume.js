document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, JS працює ✅");

    const fullName = "NOEL TAYLOR";
    const jobTitle = "GRAPHIC & WEB DESIGNER";

    const nameEl = document.getElementById("personName");
    const jobEl  = document.getElementById("personJob");

    if (nameEl) {
        nameEl.textContent = fullName;
    }

    if (jobEl) {
        jobEl.textContent = jobTitle;
    }
});

function initToggleSections() {
    const sections = document.querySelectorAll(".js-toggle-section");

    sections.forEach(section => {
        const arrow = section.querySelector(".js-toggle-arrow");
        const content = section.querySelector(".js-toggle-content");

        if (!arrow || !content) return;

        arrow.addEventListener("click", () => {
            content.classList.toggle("is-hidden");
            arrow.classList.toggle("arrow-rotated");
        });
    });
}

// Викликаємо після завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
    initToggleSections();
});

