// JavaScript pour ProConnect RH

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navbar = document.getElementById('navbar');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const contactForm = document.getElementById('contact-form');
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    // Mobile Menu Toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('open');
            
            // Change hamburger icon
            const icon = mobileMenuButton.querySelector('svg');
            if (mobileMenu.classList.contains('open')) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
            }
        });
    }

    // Smooth Navigation & Active State
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('open');
                    const icon = mobileMenuButton.querySelector('svg');
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
                }
                
                // Smooth scroll
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveNavLink(targetId);
            }
        });
    });

    // Update active navigation link
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    // Scroll Effects
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // Navbar scroll effect
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active section based on scroll position
        updateActiveSection();
        
        // Animate elements on scroll
        animateOnScroll();
    });

    // Update active section based on scroll position
    function updateActiveSection() {
        const sections = ['accueil', 'services', 'apropos', 'contact'];
        let currentSection = 'accueil';
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = sectionId;
                }
            }
        });
        
        updateActiveNavLink(currentSection);
    }

    // Animate elements on scroll
    function animateOnScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    // Contact Form Handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Validation
            if (!validateForm(data)) {
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Envoi en cours...';
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    // Reset form
                    if (contactForm && typeof contactForm.reset === 'function') {
                        contactForm.reset();
                    }
                    
                    // Show success message
                    showSuccessMessage();
                    
                    // Reset button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('loading');
                }, 2000);
            }
        });
    }

    // Form validation
    function validateForm(data) {
        let isValid = true;
        const errors = [];
        
        // Required fields
        if (!data.prenom || data.prenom.trim() === '') {
            errors.push('Le prénom est requis');
            highlightError('prenom');
            isValid = false;
        }
        
        if (!data.nom || data.nom.trim() === '') {
            errors.push('Le nom est requis');
            highlightError('nom');
            isValid = false;
        }
        
        if (!data.email || data.email.trim() === '') {
            errors.push('L\'email est requis');
            highlightError('email');
            isValid = false;
        } else if (!isValidEmail(data.email)) {
            errors.push('L\'email n\'est pas valide');
            highlightError('email');
            isValid = false;
        }
        
        if (!isValid) {
            showErrorMessage(errors);
        }
        
        return isValid;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Highlight form errors
    function highlightError(fieldName) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('border-red-500');
            field.addEventListener('input', function() {
                field.classList.remove('border-red-500');
            }, { once: true });
        }
    }

    // Show error message
    function showErrorMessage(errors) {
        removeMessages();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
        errorDiv.innerHTML = `
            <strong class="font-bold">Erreurs dans le formulaire :</strong>
            <ul class="mt-2">
                ${errors.map(error => `<li>• ${error}</li>`).join('')}
            </ul>
        `;
        contactForm.insertBefore(errorDiv, contactForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Show success message
    function showSuccessMessage() {
        removeMessages();
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 success-message';
        successDiv.innerHTML = `
            <strong class="font-bold">Message envoyé avec succès !</strong>
            <p class="mt-1">Nous vous recontacterons dans les plus brefs délais.</p>
        `;
        contactForm.insertBefore(successDiv, contactForm.firstChild);
        
        // Animate in
        setTimeout(() => {
            successDiv.classList.add('show');
        }, 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }

    // Remove existing messages
    function removeMessages() {
        const existingMessages = contactForm.querySelectorAll('.bg-red-100, .bg-green-100');
        existingMessages.forEach(msg => msg.remove());
    }

    // Initialize animations on load
    animateOnScroll();

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('open');
            const icon = mobileMenuButton.querySelector('svg');
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Performance optimization: Debounced scroll handler
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                animateOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Replace direct scroll listener for animations
    window.addEventListener('scroll', requestTick, { passive: true });

    // Preload critical resources
    function preloadResources() {
        const criticalImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img instanceof HTMLImageElement) {
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('loading');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        criticalImages.forEach(img => {
            if (img instanceof HTMLImageElement) {
                imageObserver.observe(img);
            }
        });
    }

    // Initialize performance optimizations
    preloadResources();
});

// Utility functions
const Utils = {
    // Debounce function
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};