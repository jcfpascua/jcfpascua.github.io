// 1. Smooth Scrolling for Navigation Links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 2. Hover Zoom Effect for Certificates
const certImages = document.querySelectorAll('.cert-image');
certImages.forEach(image => {
    image.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.2)';
        image.style.transition = 'transform 0.3s ease';
    });
    image.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1)';
    });
});

// 3. Dark Mode Toggle Function
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        document.body.style.backgroundColor = '#22223b';
        document.body.style.color = '#f2e9e4';
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.style.color = '#f2e9e4';
        });
    } else {
        document.body.style.backgroundColor = '#f2e9e4';
        document.body.style.color = '#22223b';
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.style.color = '#22223b';
        });
    }
});

// 4. Typing Effect for Header Text
function typingEffect(elementId, text, speed) {
    let i = 0;
    const element = document.getElementById(elementId);
    element.textContent = '';

    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();
}

// Example usage of typing effect:
window.addEventListener('load', () => {
    typingEffect('header h1', 'Welcome to My Portfolio', 100);
});
