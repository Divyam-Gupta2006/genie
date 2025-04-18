import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

if (!sessionStorage.getItem("logoutOnce")) {
    sessionStorage.setItem("logoutOnce", "true");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in. Logging out now...");
            signOut(auth).then(() => {
                console.log("User logged out.");
                window.location.href = "login.html";
            }).catch((error) => {
                console.error("Sign out error:", error);
            });
        } else {
            console.log("User is already logged out.");
        }
    });
} else {
    console.log("Logout already performed this session.");
}

document.addEventListener("DOMContentLoaded", function () {
    initializeProfileSidebar();

    const cartButton = document.getElementById('cart-btn');
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (auth.currentUser) {
                window.location.href = 'cart.html';
            } else {
                console.log("No user signed in. Redirecting to login.html");
                window.location.href = 'login.html';
            }
        });
    }

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
                setTimeout(typeEffect, 1000);
                return;
            }
        } else {
            searchInput.placeholder = "Search for " + currentService.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                serviceIndex = (serviceIndex + 1) % services.length;
            }
        }

        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }

    if (searchInput) {
        typeEffect();
    }

    const carousel = document.querySelector('.carousel');
    if (carousel) {
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', redirectToPage);
    });
});

function redirectToPage(event) {
    console.log("redirectToPage function called");
    const userAuth = auth;
    console.log("Current user:", userAuth.currentUser);
    if (userAuth.currentUser) {
        const elementId = event.currentTarget.id;
        console.log("Element ID:", elementId);
        switch (elementId) {
            case 'Home-Care': window.location.href = 'cart.html'; break;
            case 'Pet-Care': window.location.href = 'cart.html'; break;
            case 'Salon-at-Home': window.location.href = 'cart.html'; break;
            case 'Party-Planners': window.location.href = 'cart.html'; break;
            case 'House-Repairs': window.location.href = 'cart.html'; break;
            case 'Complete-Event-Care': window.location.href = 'cart.html'; break;
            default: console.log('No redirect page specified');
        }
    } else {
        console.log("No user signed in. Redirecting to login.html");
        window.location.href = 'login.html';
    }
}

function initializeProfileSidebar() {
    const profileButton = document.getElementById('profile-btn');
    const sidebar = document.getElementById('profile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeButton = document.getElementById('close-sidebar');
    const logoutButton = document.getElementById('logout-button');
    const userInfo = document.querySelector('.user-info');
    
    if (!profileButton || !sidebar || !overlay || !closeButton || !logoutButton) {
        console.error('Required elements not found');
        return;
    }
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User is signed in:', user.email);
            
            if (userInfo) {
                const usernameElement = userInfo.querySelector('.username');
                const emailElement = userInfo.querySelector('.email');
                if (usernameElement) {
                    usernameElement.textContent = user.displayName || 'User';
                }
                if (emailElement) {
                    emailElement.textContent = user.email || 'No email available';
                }
            }
            
            profileButton.addEventListener('click', (e) => {
                e.preventDefault();
                openSidebar();
            });
            
            const contactButton = document.createElement('a');
            contactButton.className = 'menu-item contact-button';
            contactButton.innerHTML = `
                <i class="fas fa-phone"></i>
                Contact Us
            `;
            contactButton.href = '#';
            
            const sidebarMenu = document.querySelector('.sidebar-menu');
            if (sidebarMenu) {
                sidebarMenu.insertBefore(contactButton, logoutButton);
            }
            
            contactButton.addEventListener('click', (e) => {
                e.preventDefault();
                handleContactUs();
            });
            
        } else {
            console.log('No user signed in');
            profileButton.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    });
    
    closeButton.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    logoutButton.addEventListener('click', handleLogout);
    
    function openSidebar() {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        sidebar.style.transform="translateX(0)";
    }
    
    function closeSidebar() {
        sidebar.style.transform = "translateX(100%)";
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    }
    
    function handleLogout() {
        auth.signOut().then(() => {
            console.log('User signed out successfully');
            window.location.href = 'loading.html';
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    }
    
    function handleContactUs() {
        window.location="contact.html";
    }
}


