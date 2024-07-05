// script.js

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('#project-list .col-md-6');

    filterButtons.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            const filter = button.getAttribute('data-filter');

            // Remove 'active' class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            // Filter items
            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filter === 'all' || itemCategory === filter) {
                    if (item.classList.contains('hidden')) {
                        item.classList.remove('hidden', 'fadeOut');
                        item.classList.add('fadeIn');
                    }
                } else {
                    if (!item.classList.contains('hidden')) {
                        item.classList.remove('fadeIn');
                        item.classList.add('fadeOut');
                        setTimeout(() => {
                            item.classList.add('hidden');
                        }, 500); // Match the duration of the fadeOut animation
                    }
                }
            });
        });
    });
});

// Contact Form

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Show loading spinner and disable the button
    document.getElementById('buttonSpinner').classList.remove('hidden');
    document.getElementById('buttonText').classList.add('hidden');
    document.getElementById('submitButton').disabled = true;

    // Form data
    const formData = new FormData(this);

    // AJAX request
    fetch('https://formspree.io/f/mvgpooel', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        // Handle response
        document.getElementById('buttonSpinner').classList.add('hidden');
        document.getElementById('buttonText').classList.remove('hidden');
        document.getElementById('submitButton').disabled = false;

        let messageBox = document.getElementById('form-messages');
        messageBox.classList.remove('hidden');
        if (response.ok) {
            messageBox.classList.add('bg-green-100', 'text-green-700');
            messageBox.innerHTML = 'Your message has been sent successfully!';
            document.getElementById('contactForm').reset();
        } else {
            response.json().then(data => {
                messageBox.classList.add('bg-red-100', 'text-red-700');
                if (data.errors) {
                    messageBox.innerHTML = data.errors.map(error => error.message).join('<br>');
                } else {
                    messageBox.innerHTML = 'Oops! Something went wrong. Please try again later.';
                }
            });
        }
    })
    .catch(error => {
        // Handle error
        document.getElementById('buttonSpinner').classList.add('hidden');
        document.getElementById('buttonText').classList.remove('hidden');
        document.getElementById('submitButton').disabled = false;

        let messageBox = document.getElementById('form-messages');
        messageBox.classList.remove('hidden');
        messageBox.classList.add('bg-red-100', 'text-red-700');
        messageBox.innerHTML = 'Oops! There was a problem submitting your form. Please try again.';
    });
});

// Typewriter effect for placeholder text
function typeWriter(text, element) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.placeholder += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }
    setTimeout(type, 1000); // 1 second delay before starting
}

// Intersection Observer to trigger typewriter effect when textarea is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const textarea = entry.target;
            const text = textarea.dataset.placeholder; // Retrieve text from data-placeholder attribute
            textarea.placeholder = ''; // Clear the placeholder
            typeWriter(text, textarea); // Start typing animation
            observer.unobserve(textarea); // Stop observing once the animation starts
        }
    });
}, { threshold: 0.5 }); // Trigger when at least 50% is visible

// Start observing the textarea
const textarea = document.getElementById('message');
// Use a data attribute to store the placeholder text initially
textarea.dataset.placeholder = textarea.placeholder;
observer.observe(textarea);