import { auth } from './firebase-config.js';
import {
    onAuthStateChanged,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const messageBox = document.getElementById("messageBox");
const passwordBox = document.getElementById("passwordBox");
const passwordInput = document.getElementById("passwordInput");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    }
});

yesBtn.addEventListener("click", () => {
    // Show password input box
    passwordBox.style.display = "block";
});

// Toggle password visibility
togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;

    // Toggle the eye icon (open or closed)
    eyeIcon.classList.toggle("fa-eye");
    eyeIcon.classList.toggle("fa-eye-slash");
});

confirmDeleteBtn.addEventListener("click", async () => {
    const password = passwordInput.value;

    if (!password || !currentUser) {
        messageBox.textContent = "Please enter your password.";
        messageBox.className = "error";
        messageBox.style.display = "block";
        return;
    }

    const credential = EmailAuthProvider.credential(currentUser.email, password);

    try {
        await reauthenticateWithCredential(currentUser, credential);
        await deleteUser(currentUser);

        messageBox.textContent = "Account deleted successfully.";
        messageBox.className = "success";
        messageBox.style.display = "block";

        setTimeout(() => {
            window.location.href = "loading.html";
        }, 1500);
    } catch (error) {
        console.error("Error deleting account:", error);
        messageBox.textContent = "Error: " + error.message;
        messageBox.className = "error";
        messageBox.style.display = "block";
    }
});

noBtn.addEventListener("click", () => {
    window.location.href = "loading.html";
});
