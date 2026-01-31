// Images for the main carousel (only 4 - these cycle with arrows and dots)
const carouselImages = [
    'assets/images/product-1.png',
    'assets/images/product-5.jpg',
    'assets/images/product- 6.jpg',
    'assets/images/product- 4.jpg'
];

// All images for thumbnails (8 images - can click any)
const allImages = [
    'assets/images/product-4.jpg',
    'assets/images/product-5.jpg',
    'assets/images/product-6.jpg',
    'assets/images/product-4.jpg',
    'assets/images/product-3.jpg',
    'assets/images/product-5.jpg',
    'assets/images/product-6.jpg',
    'assets/images/product-4.jpg'
];

let currentImageIndex = 0;

// Change image function - cycles through 4 carousel images
function changeImage(direction) {
    if (direction === 1) {
        currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
    } else {
        currentImageIndex = (currentImageIndex - 1 + carouselImages.length) % carouselImages.length;
    }
    updateGallery();
}

// Select specific image when clicking thumbnails
function selectImage(index) {
    // Update the main image to show the clicked thumbnail
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = allImages[index];
    }
    
    // Update thumbnails to show which one is active
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    
    // If the clicked thumbnail is one of the first 4 carousel images,
    // update the carousel position and dots
    if (index < carouselImages.length) {
        currentImageIndex = index;
        updateDots();
    } else {
        updateDots(-1);
    }
}

// Update gallery display
function updateGallery() {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = carouselImages[currentImageIndex];
    }
    
    updateDots();
    
    // Update thumbnails - highlight the one matching current carousel image
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', allImages[i] === carouselImages[currentImageIndex]);
    });
}

// Update dots display
function updateDots(activeIndex = currentImageIndex) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        if (activeIndex === -1) {
            dot.classList.remove('active');
        } else {
            dot.classList.toggle('active', i === activeIndex);
        }
    });
}

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('mainNav');

if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

// Subscription Selection with expansion/collapse
function selectSubscription(card) {
    // Remove selected class from all cards
    document.querySelectorAll('.subscription-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    card.classList.add('selected');
    
    updateAddToCart();
}

// Fragrance Selection
function selectFragrance(option, event) {
    // Prevent event from bubbling to parent subscription card
    if (event) {
        event.stopPropagation();
    }
    
    // Get parent subscription card
    const subscriptionCard = option.closest('.subscription-card');
    
    // Get the parent fragrance grid to only deselect within same grid
    const fragranceGrid = option.closest('.fragrance-grid');
    
    // Remove selected class from all fragrances in this grid only
    fragranceGrid.querySelectorAll('.fragrance-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    option.classList.add('selected');
    
    updateAddToCart();
}

// Update Add to Cart button and link
function updateAddToCart() {
    const selectedCard = document.querySelector('.subscription-card.selected');
    const button = document.querySelector('.add-to-cart');
    
    if (!selectedCard || !button) return;
    
    // Get subscription type
    const subscriptionType = selectedCard.querySelector('.subscription-name').textContent.trim();
    
    // Get selected fragrances
    const selectedFragrances = selectedCard.querySelectorAll('.fragrance-option.selected .fragrance-name');
    
    let fragranceText = '';
    if (subscriptionType.includes('Double')) {
        // For double subscription, get both fragrances
        const fragrance1 = selectedFragrances[0] ? selectedFragrances[0].textContent.trim() : 'Original';
        const fragrance2 = selectedFragrances[1] ? selectedFragrances[1].textContent.trim() : 'Original';
        fragranceText = `${fragrance1} + ${fragrance2}`;
    } else {
        // For single subscription, get one fragrance
        fragranceText = selectedFragrances[0] ? selectedFragrances[0].textContent.trim() : 'Original';
    }
    
    // Update button text
    button.textContent = `Add to Cart`;
    
    // Generate unique cart link based on selection
    const subscriptionSlug = subscriptionType.toLowerCase().replace(/\s+/g, '-');
    const fragranceSlug = fragranceText.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, 'and');
    const cartLink = `https://example.com/cart?add=${subscriptionSlug}_${fragranceSlug}`;
    
    // Store the link in a data attribute
    button.setAttribute('data-cart-link', cartLink);
    
    console.log('Cart Link Updated:', cartLink);
}

// Accordion Toggle
function toggleAccordion(header) {
    const item = header.parentElement;
    const allItems = document.querySelectorAll('.accordion-item');
    
    // Close all other accordion items
    allItems.forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
            const icon = otherItem.querySelector('.accordion-icon');
            if (icon) icon.textContent = '+';
        }
    });
    
    // Toggle current item
    item.classList.toggle('active');
    const icon = header.querySelector('.accordion-icon');
    if (item.classList.contains('active')) {
        icon.textContent = '−';
    } else {
        icon.textContent = '+';
    }
}

// Add to cart functionality
function addToCart() {
    const selectedCard = document.querySelector('.subscription-card.selected');
    if (!selectedCard) {
        alert('Please select a subscription option');
        return;
    }
    
    const button = document.querySelector('.add-to-cart');
    const cartLink = button.getAttribute('data-cart-link');
    
    const subscriptionType = selectedCard.querySelector('.subscription-name').textContent.trim();
    const selectedFragrances = selectedCard.querySelectorAll('.fragrance-option.selected .fragrance-name');
    const price = selectedCard.querySelector('.current-price').textContent;
    
    let fragranceText = '';
    if (subscriptionType.includes('Double')) {
        const fragrance1 = selectedFragrances[0] ? selectedFragrances[0].textContent.trim() : 'Original';
        const fragrance2 = selectedFragrances[1] ? selectedFragrances[1].textContent.trim() : 'Original';
        fragranceText = `${fragrance1} + ${fragrance2}`;
    } else {
        fragranceText = selectedFragrances[0] ? selectedFragrances[0].textContent.trim() : 'Original';
    }
    
    console.log('Adding to cart:', {
        subscription: subscriptionType,
        fragrance: fragranceText,
        price: price,
        link: cartLink
    });
    
    alert(`Added to cart:\n${subscriptionType}\n${fragranceText}\n${price}`);
    
    // Visual feedback - change button text temporarily
    const originalText = button.textContent;
    button.textContent = 'Added to Cart ✓';
    button.style.backgroundColor = '#00C853';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// Scroll to Product Section function
function scrollToProductSection() {
    const productSection = document.querySelector('.product-section');
    if (productSection) {
        productSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Counter Animation for Statistics
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + '%';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    //window.requestAnimationFrame(step);
}

// Initialize counter animation when stats section is visible
function initStatsCounter() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    const statNumbers = statsSection.querySelectorAll('.stat-percentage');
    let animated = false;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                
                statNumbers.forEach(stat => {
                    const targetText = stat.textContent;
                    const targetNumber = parseInt(targetText);
                    
                    // Animate from 0 to target number
                    animateCounter(stat, 0, targetNumber, 2000);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    observer.observe(statsSection);
}

// Keyboard navigation for gallery - only cycles through 4 carousel images
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeImage(-1);
    } else if (e.key === 'ArrowRight') {
        changeImage(1);
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize gallery
    updateGallery();
    
    // Initialize add to cart
    updateAddToCart();
    
    // Initialize stats counter
    initStatsCounter();
    
    // Add event listeners to "Shop Now" buttons to scroll to product section
    const shopNowButtons = document.querySelectorAll('.cta-btn');
    shopNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToProductSection();
        });
    });
    
    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Add entrance animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(section);
    });
    
    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            // Add any scroll-based functionality here
        });
    });
});

// Performance: Optimize images on load
window.addEventListener('load', () => {
    // Preload critical images
    const criticalImages = [
        'assets/images/product-1.png',
        'assets/images/hero-bg.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Cross-browser compatibility for smooth scroll
if (!('scrollBehavior' in document.documentElement.style)) {
    // Polyfill for smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetPosition = target.offsetTop;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }
                
                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
}