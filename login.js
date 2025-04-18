import { auth } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { db } from './firebase-config.js';
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

async function logUserActivity(user) {
    await setDoc(doc(db, "user_visits", user.uid), {
        email: user.email,
        lastVisit: serverTimestamp()
    });
}

window.showSignIn = function () {
    document.getElementById("signInDiv").style.display = "block";
    document.getElementById("signUpDiv").style.display = "none";
};

window.showSignUp = function () {
    document.getElementById("signInDiv").style.display = "none";
    document.getElementById("signUpDiv").style.display = "block";
};

function showMessage(text, type) {
    const messageBox = document.getElementById("messageBox");
    messageBox.textContent = text;
    messageBox.className = type;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 3000);
}

window.registerUser = function () {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const name= document.getElementById("registerName").value;

    if (!email || !password || !name) {
        showMessage("Please enter all credentials.", "error");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password,name)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById("loginEmail").value="";
            document.getElementById("loginPassword").value="";
            document.getElementById("loginName").value="";

            sendEmailVerification(user)
                .then(() => {
                    showMessage("Verification email sent! Check your inbox.", "success");
                    logUserActivity(user);

                    const checkVerification = setInterval(() => {
                        user.reload().then(() => {
                            if (user.emailVerified) {
                                clearInterval(checkVerification); // Stop checking
                                showMessage("Email verified! Redirecting to Sign In...", "success");

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

window.loginUser = function () {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const name = document.getElementById("loginName").value;

    if (!email || !password || !name) {
        showMessage("Please enter all credentials.", "error");
        return;
    }

    signInWithEmailAndPassword(auth, email, password, name)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById("loginEmail").value="";
            document.getElementById("loginPassword").value="";
            document.getElementById("loginName").value="";

            if (user.emailVerified) {
                showMessage("Login successful!", "success");
                logUserActivity(user);
                setTimeout(() => {
                    window.location.href = "loading.html";
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


