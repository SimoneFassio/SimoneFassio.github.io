// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.getElementById('contact-form');

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile nav when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Skill bars animation on scroll
    const animateSkillBars = function() {
        skillBars.forEach(bar => {
            const barTop = bar.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (barTop < windowHeight - 100) {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    };

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars();
                }
                
                // Add fade-in animation to elements
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Contact form handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual form handling)
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // Initialize hero chart
    initHeroChart();
    
    // Add typing effect to hero title
    initTypingEffect();
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Hero chart initialization
function initHeroChart() {
    const canvas = document.getElementById('hero-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 280;
    canvas.height = 280;
    
    // Data for the chart (representing data science skills)
    const data = [85, 78, 92, 88, 75];
    const labels = ['Python', 'ML/AI', 'Statistics', 'Data Viz', 'SQL'];
    const colors = [
        '#3b82f6',
        '#10b981', 
        '#f59e0b',
        '#ef4444',
        '#8b5cf6'
    ];
    
    // Draw radar chart
    drawRadarChart(ctx, data, labels, colors, 280, 280);
}

// Radar chart drawing function
function drawRadarChart(ctx, data, labels, colors, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    const angleStep = (2 * Math.PI) / data.length;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        const currentRadius = (radius / 5) * i;
        for (let j = 0; j < data.length; j++) {
            const angle = j * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * currentRadius;
            const y = centerY + Math.sin(angle) * currentRadius;
            
            if (j === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // Draw grid lines
    for (let i = 0; i < data.length; i++) {
        ctx.beginPath();
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    
    // Draw data
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = (data[i] / 100) * radius;
        const x = centerX + Math.cos(angle) * value;
        const y = centerY + Math.sin(angle) * value;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    // Draw data points
    for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = (data[i] / 100) * radius;
        const x = centerX + Math.cos(angle) * value;
        const y = centerY + Math.sin(angle) * value;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = colors[i];
        ctx.fill();
    }
    
    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < labels.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 25;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        
        ctx.fillText(labels[i], x, y);
    }
}

// Typing effect for hero title
function initTypingEffect() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;
    
    const originalText = titleElement.innerHTML;
    const highlightStart = originalText.indexOf('<span class="highlight">');
    const highlightEnd = originalText.indexOf('</span>') + 7;
    
    if (highlightStart === -1) return;
    
    const beforeHighlight = originalText.substring(0, highlightStart);
    const highlightText = originalText.substring(highlightStart, highlightEnd);
    const afterHighlight = originalText.substring(highlightEnd);
    
    titleElement.innerHTML = beforeHighlight;
    
    let i = 0;
    const speed = 100;
    
    function typeWriter() {
        if (i < highlightText.length) {
            titleElement.innerHTML = beforeHighlight + highlightText.substring(0, i + 1);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            titleElement.innerHTML = originalText;
        }
    }
    
    setTimeout(typeWriter, 1000);
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        const rate = scrolled * -0.5;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// Add smooth scroll behavior for all anchor links
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

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate skill bars after page load
    setTimeout(animateSkillBars, 500);
});

// Animate skill bars function (standalone for reuse)
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = 'none';
            bar.offsetHeight; // Trigger reflow
            bar.style.animation = 'fillBar 1.5s ease-in-out forwards';
        }, index * 200);
    });
}

// Add CSS animation for skill bars
const style = document.createElement('style');
style.textContent = `
    @keyframes fillBar {
        from {
            width: 0;
        }
        to {
            width: var(--bar-width, 0%);
        }
    }
`;
document.head.appendChild(style);

// Set CSS custom properties for skill bar widths
document.querySelectorAll('.skill-progress').forEach(bar => {
    const width = bar.style.width;
    bar.style.setProperty('--bar-width', width);
    bar.style.width = '0';
});

// Add intersection observer for project cards
const projectCards = document.querySelectorAll('.project-card');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});

// Add scroll-to-top functionality
const scrollToTop = document.createElement('button');
scrollToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTop.className = 'scroll-to-top';
scrollToTop.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(scrollToTop);

scrollToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTop.style.display = 'flex';
    } else {
        scrollToTop.style.display = 'none';
    }
});

scrollToTop.addEventListener('mouseenter', () => {
    scrollToTop.style.transform = 'scale(1.1)';
});

scrollToTop.addEventListener('mouseleave', () => {
    scrollToTop.style.transform = 'scale(1)';
});