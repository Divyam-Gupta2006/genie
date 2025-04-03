
document.addEventListener("readystatechange", function () {
    let progressBar = document.getElementById("progress-bar");
    let loadingScreen = document.getElementById("loading-screen");
    let content = document.getElementById("content");

    let loadingStages = { "loading": 30, "interactive": 70, "complete": 100 };
    let progress = loadingStages[document.readyState] || 0;

    progressBar.style.width = progress + "%";
    progressBar.style.background = `linear-gradient(to right, purple ${100 - progress}%, white ${progress}%)`;

    if (document.readyState === "complete") {
        setTimeout(() => {
            loadingScreen.style.display = "none";
            content.style.display = "block";
        }, 500);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");

    const services = [
        "House Help",
        "Pet Care",
        "Salon at Home",
        "Party Planners",
        "House Repairs",
        "Complete Event Care"
    ];

    let serviceIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentService = services[serviceIndex];

        if (!isDeleting) {
            searchInput.placeholder = "Search for " + currentService.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentService.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1000); // Pause before deleting
                return;
            }
        } else {
            searchInput.placeholder = "Search for " + currentService.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                serviceIndex = (serviceIndex + 1) % services.length; // Move to next service
            }
        }

        setTimeout(typeEffect, isDeleting ? 50 : 100); // Speed of typing and deleting
    }

    typeEffect();
});





