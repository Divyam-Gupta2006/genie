import { auth } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Function to show/hide forms
window.showSignIn = function () {
    document.getElementById("signInDiv").style.display = "block";
    document.getElementById("signUpDiv").style.display = "none";
};

window.showSignUp = function () {
    document.getElementById("signInDiv").style.display = "none";
    document.getElementById("signUpDiv").style.display = "block";
};

// Function to show messages
function showMessage(text, type) {
    const messageBox = document.getElementById("messageBox");
    messageBox.textContent = text;
    messageBox.className = type;
    messageBox.style.display = "block";

    // Hide message after 3 seconds
    setTimeout(() => {
        messageBox.style.display = "none";
    }, 3000);
}

// Register User
window.registerUser = function () {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (!email || !password) {
        showMessage("Please enter email and password.", "error");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById("loginEmail").value="";
            document.getElementById("loginPassword").value="";

            sendEmailVerification(user)
                .then(() => {
                    showMessage("Verification email sent! Check your inbox.", "success");

                    // Check every 3 seconds if the user has verified their email
                    const checkVerification = setInterval(() => {
                        user.reload().then(() => {
                            if (user.emailVerified) {
                                clearInterval(checkVerification); // Stop checking
                                showMessage("Email verified! Redirecting to Sign In...", "success");

                                // Switch to Sign-In form after verification
                                setTimeout(() => {
                                    showSignIn();
                                }, 2000);
                            }
                        });
                    }, 500);
                })
                .catch((error) => {
                    console.error("Error sending verification email:", error);
                    showMessage(error.message);
                });
        })
        .catch((error) => {
            console.error("Error registering user:", error);
            showMessage(error.message);
        });
};

// Login User
window.loginUser = function () {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        showMessage("Please enter email and password.", "error");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById("loginEmail").value="";
            document.getElementById("loginPassword").value="";

            if (user.emailVerified) {
                showMessage("Login successful!", "success");
                setTimeout(() => {
                    window.location.href = "dashboard.html"; // Replace with your page
                }, 2000);
            } else {
                showMessage("Please verify your email before logging in.", "error");
            }
        })
        .catch((error) => {
            console.error("Error logging in:", error);
            showMessage(error.message);
        });
};