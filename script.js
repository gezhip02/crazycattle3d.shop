// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links and Download Button
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Download Now Button Smooth Scroll
document.getElementById('downloadNowBtn').addEventListener('click', function(e) {
    e.preventDefault();
    const downloadSection = document.getElementById('download');
    downloadSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked FAQ item if it wasn't already open
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.hamburger')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
}); 