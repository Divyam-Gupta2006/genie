// contact.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your user ID
    emailjs.init("6ibrAS3wQ0rPYby6B");
    
    const messageButton = document.querySelector('#MessageDiv button');
    messageButton.addEventListener('click', Message);
});

function Message() {
    // Get all input values
    const nameInput = document.getElementById('Name');
    const emailInput = document.getElementById('Email');
    const messageInput = document.getElementById('Message');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    const messageBox = document.getElementById('messageBox');
    const errorMessage = document.getElementById('error-message');
    
    // Validate name
    if (!name) {
        errorMessage.textContent = "Please enter your name.";
        errorMessage.style.display = "block";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
        return;
    }
    
    // Validate email
    if (!email) {
        errorMessage.textContent = "Please enter your email address.";
        errorMessage.style.display = "block";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
        return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = "Please enter a valid email address.";
        errorMessage.style.display = "block";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
        return;
    }
    
    // Validate message
    if (!message) {
        errorMessage.textContent = "Please enter a message before sending.";
        errorMessage.style.display = "block";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
        return;
    }
    
    // Clear any previous error messages
    errorMessage.textContent = "";
    
    // Display loading state
    messageBox.textContent = "Sending your message...";
    messageBox.style.display = "block";
    
    // Prepare template parameters
    const templateParams = {
        name: name,
        from_email: email,
        reply_to: email,
        message: message
    };

    const templateParams1 = {
        name: name,
        from_email: email,
        title: message
    }
    
    // Send email using EmailJS
    emailjs.send('service_z0bfml6', 'template_2u7mdte', templateParams)
        .then(function(response) {
            emailjs.send('service_z0bfml6','template_xeqjxbb',templateParams1);
            console.log('SUCCESS!', response.status, response.text);
            messageBox.textContent = "Message sent!";
            messageBox.style.color = "green";
            nameInput.value = "";
            emailInput.value = "";
            messageInput.value = "";
            setTimeout(() => {
                messageBox.style.display = "none";
            }, 3000);
        }, function(error) {
            console.log('FAILED...', error);
            errorMessage.textContent = "Failed to send message. Please try again later.";
            errorMessage.style.display = "block";
            messageBox.style.display = "none";
        });
}


