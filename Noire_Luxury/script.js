// NOIRÉ - Timeless Luxury JavaScript

document.addEventListener('DOMContentLoaded', () => {

    // --- Data: Products ---
    // Using placeholder images from Unsplash that fit the description
    const products = [
        {
            id: 1,
            name: "Obsidian Tailored Suit",
            price: 2450,
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTAwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iMTAwMCIgZmlsbD0iIzBBMkEyQSIvPgogICAgPHBhdGggZD0iTTQwMCAxNTBMMTUwIDI1MFY0NTBMNDAwIDkwMEw2NTAgNDUwVjI1MEw0MDAgMTUwWiIgZmlsbD0iIzE1MTUxNSIgc3Ryb2tlPSIjYzlhMjI3IiBzdHJva2Utd2lkdGg9IjIiLz4KICAgIDxwYXRoIGQ9Ik00MDAgMTUwTDMwMCAzNTBMNDAwIDUwMEw1MDAgMzUwTDQwMCAxNTBaIiBmaWxsPSIjMEYwRjBGIiBzdHJva2U9IiNjOWEyMjciIHN0cm9rZS13aWR0aD0iMSIvPgogICAgPGNpcmNsZSBjeD0iNDAwIiBjeT0iNTUwIiByPSI1IiBmaWxsPSIjYzlhMjI3Ii8+CiAgICA8Y2lyY2xlIGN4PSI0MDAiIGN5PSI2MDAiIHI9IjUiIGZpbGw9IiNjOWEyMjciLz4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjQwMCIgeTE9IjE1MCIgeDI9IjQwMCIgeTI9IjkwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMUExQTFBIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzA1MDUwNSIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8L2RlZnM+Cjwvc3ZnPg==",
            description: "Hand-stitched Italian wool suit with a modern slim fit. Sharp lines meet timeless elegance.",
            category: "men"
        },
        {
            id: 2,
            name: "Gilded Evening Gown",
            price: 3800,
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTAwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iMTAwMCIgZmlsbD0iIzA1MDUwNSIvPgogICAgPHBhdGggZD0iTTQwMCAxMDBMMjUwIDQwMEw0MDAgOTAwTDY1MCA0MDBMNDAwIDEwMFoiIGZpbGw9IiNjOWEyMjciIG9wYWNpdHk9IjAuNiIvPgogICAgPHBhdGggZD0iTTQwMCAxNTBMMzAwIDI1MEw0MDAgNjAwTDUwMCAyNTBMNDAwIDE1MFoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4=",
            description: "A floor-length masterpiece dripping in gold accents. Perfect for the most exclusive galas.",
            category: "women"
        },
        {
            id: 3,
            name: "Urban Silk Hoodie",
            price: 850,
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTAwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iMTAwMCIgZmlsbD0iIzE1MTUxNSIvPgogICAgPHJlY3QgeD0iMjUwIiB5PSIyNTAiIHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiByeD0iNTAiIGZpbGw9IiMyQTJBMkEiLz4KICAgIDxwYXRoIGQ9Ik0yNTAgMzAwQzI1MCAyMDAgMDUwIDMwMCAwNTAgNDEwIiBzdHJva2U9IiMyQTJBMkEiIHN0cm9rZS13aWR0aD0iNDAiLz4KICAgIDxwYXRoIGQ9Ik01NTAgMzAwQzU1MCAyMDAgNzUwIDMwMCA3NTAgNDEwIiBzdHJva2U9IiMyQTJBMkEiIHN0cm9rZS13aWR0aD0iNDAiLz4KPC9zdmc+",
            description: "Luxury streetwear redefined. 100% heavy silk blend with oversized comfort.",
            category: "men"
        },
        {
            id: 4,
            name: "Noir Leather Jacket",
            price: 1950,
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTAwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iMTAwMCIgZmlsbD0iIzA1MDUwNSIvPgogICAgPHBhdGggZD0iTTE1MCAyNTAgSCA2NTAgViAzNTAgQyA2NTAgNTAwIDQwMCA5MDAgMTUwIDM1MFoiIGZpbGw9IiMxQTFBMUEiIHN0cm9rZT0iIzQ0NCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8cGF0aCBkPSJNMzAwIDM1MCBWIDkwMCBNNTAwIDM1MCBWIDkwMCIgc3Ryb2tlPSIjMTExIiBzdHJva2Utd2lkdGg9IjEwIi8+Cjwvc3ZnPg==",
            description: "Premium calfskin leather with gunmetal hardware. A rebellious classic.",
            category: "limited"
        },
        {
            id: 5,
            name: "Ethereal White Dress",
            price: 1200,
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTAwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iMTAwMCIgZmlsbD0iIzA5MDkwOSIvPgogICAgPHBhdGggZD0iTTQwMCAxNTAgQyAxNTAgNTAwIDIwMCA5MDAgNDAwIDkwMCBDIDYwMCA5MDAgNjUwIDUwMCA0MDAgMTUwWiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC45Ii8+Cjwvc3ZnPg==",
            description: "Minimalist design meeting structural perfection. Pure architectural fashion.",
            category: "women"
        },
        {
            id: 6,
            name: "Oversized Blazer",
            price: 1100,
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTAwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iMTAwMCIgZmlsbD0iIzE1MTUxNSIvPgogICAgPHJlY3QgeD0iMTAwIiB5PSIyMDAiIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiByeD0iMTAiIGZpbGw9IiMxQTFBMUEiIHN0cm9rZT0iIzQ0NCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8cGF0aCBkPSJNMzAwIDIwMCBWIDkwMCBNNTAwIDIwMCBWIDkwMCIgc3Ryb2tlPSIjMTExIiBzdHJva2Utd2lkdGg9IjUiLz4KPC9zdmc+",
            description: "Structured shoulders and relaxed fit. The ultimate statement piece for the modern era.",
            category: "women"
        }
    ];

    // --- Render Products ---
    const grid = document.querySelector('.products-grid');

    if (grid) {
        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.setAttribute('data-id', product.id);

            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price.toLocaleString()}</p>
                </div>
            `;

            card.addEventListener('click', () => openModal(product));
            grid.appendChild(card);

            // Tilt Effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
            });
        });
    }


    // --- Cart State Management ---
    let cart = JSON.parse(localStorage.getItem('noire_cart')) || [];

    function saveCart() {
        localStorage.setItem('noire_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        // Update Nav Count
        const cartCountEls = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        cartCountEls.forEach(el => {
            el.innerText = totalItems;
            // Animate only if count changed or for initial load
            gsap.from(el, { scale: 1.5, duration: 0.3, ease: 'back.out(1.7)' });
        });

        // Animate Cart Icon itself
        const cartIcons = document.querySelectorAll('.cart-icon');
        cartIcons.forEach(icon => {
            gsap.from(icon, { scale: 1.2, duration: 0.4, ease: 'back.out(1.7)' });
        });

        // If we are on the cart page, render it
        if (document.body.classList.contains('cart-page')) {
            renderCartPage();
        }
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();

        // Notification animation
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            gsap.from(cartIcon, { scale: 1.5, rotate: 15, duration: 0.4, ease: 'back.out(1.7)' });
        }
    }

    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const itemElement = document.querySelector(`.cart-item[data-id="${productId}"]`);
            if (itemElement) {
                itemElement.classList.add('removing');
                setTimeout(() => {
                    cart.splice(itemIndex, 1);
                    saveCart();
                }, 500);
            } else {
                cart.splice(itemIndex, 1);
                saveCart();
            }
        }
    }

    function updateQuantity(productId, delta) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
            }
        }
    }

    function renderCartPage() {
        const container = document.getElementById('cart-items-container');
        const emptyMsg = document.getElementById('empty-cart-msg');

        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '';
            emptyMsg.classList.remove('hidden');
            updatePrices(0);
            return;
        }

        emptyMsg.classList.add('hidden');
        container.innerHTML = '';

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.setAttribute('data-id', item.id);

            cartItem.innerHTML = `
                <a href="collection.html" class="item-img-link">
                    <img src="${item.image}" alt="${item.name}">
                </a>
                <div class="item-info">
                    <a href="collection.html" class="item-name">${item.name}</a>
                    <span class="item-meta">Category: ${item.category.toUpperCase()}</span>
                    <span class="item-price">$${item.price.toLocaleString()}</span>
                </div>
                <div class="item-qty-controls">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item-btn" data-id="${item.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;

            container.appendChild(cartItem);
        });

        // Add Listeners
        container.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(parseInt(btn.getAttribute('data-id')), 1));
        });
        container.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(parseInt(btn.getAttribute('data-id')), -1));
        });
        container.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(parseInt(btn.getAttribute('data-id'))));
        });

        // Calculate Totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        updatePrices(subtotal);
    }

    function updatePrices(subtotal) {
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;

        const subtotalEl = document.getElementById('subtotal-val');
        const taxEl = document.getElementById('tax-val');
        const totalEl = document.getElementById('total-val');

        if (subtotalEl) {
            // Animate price update
            animateValue(subtotalEl, subtotal);
            animateValue(taxEl, tax);
            animateValue(totalEl, total);
        }
    }

    function animateValue(element, value) {
        const startValue = parseFloat(element.innerText.replace('$', '').replace(/,/g, '')) || 0;
        const obj = { val: startValue };

        gsap.to(obj, {
            val: value,
            duration: 0.8,
            ease: 'power2.out',
            onUpdate: () => {
                element.innerText = `$${obj.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        });
    }

    // --- Modal Logic (Updated to use Cart) ---
    const modalBackdrop = document.querySelector('.product-modal-backdrop');
    const closeModalBtn = document.querySelector('.close-modal');
    let currentProduct = null;

    function openModal(product) {
        currentProduct = product;
        modalBackdrop.classList.add('active');

        // Populate Data
        document.querySelector('.modal-image-container img').src = product.image;
        document.querySelector('.modal-title').innerText = product.name;
        document.querySelector('.modal-price').innerText = `$${product.price.toLocaleString()}`;
        document.querySelector('.modal-description').innerText = product.description;
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modalBackdrop.classList.remove('active');
        });
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                modalBackdrop.classList.remove('active');
            }
        });
    }

    // --- Add to Cart Event Delegation ---
    document.body.addEventListener('click', (e) => {
        // From Modal
        if (e.target.closest('.add-to-cart-btn-modal')) {
            const btn = e.target.closest('.add-to-cart-btn-modal');
            if (currentProduct) {
                addToCart(currentProduct);

                // Animation for button
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span>Added to Bag</span>';
                btn.classList.add('added');

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('added');
                }, 1500);
            }
        }

        // Checkout Button
        if (e.target.closest('.checkout-btn')) {
            const btn = e.target.closest('.checkout-btn');
            btn.innerHTML = '<span>Processing...</span> <div class="loader-spinner" style="width:20px; height:20px; border-width:2px;"></div>';
            setTimeout(() => {
                alert('Checkout system currently in private preview. Contact Noiré Elite Support.');
                btn.innerHTML = '<span>Proceed to Checkout</span> <i class="fas fa-lock"></i>';
            }, 2000);
        }
    });

    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.2 });
        });

        // Hover effects for cursor
        const refreshCursorHovers = () => {
            const hoverElements = document.querySelectorAll('a, button, .product-card, .qty-btn');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    gsap.to(follower, { scale: 2, borderColor: 'transparent', backgroundColor: 'rgba(201, 162, 39, 0.2)' });
                });
                el.addEventListener('mouseleave', () => {
                    gsap.to(follower, { scale: 1, borderColor: '#c9a227', backgroundColor: 'transparent' });
                });
            });
        };
        refreshCursorHovers();
        // Periodically refresh for dynamic content
        setInterval(refreshCursorHovers, 2000);
    }

    // --- Swiper Init ---
    if (document.querySelector('.runway-swiper')) {
        const runwaySwiper = new Swiper('.runway-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            initialSlide: 1,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            }
        });
    }

    // --- GSAP Animations (Init) ---
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Reveal
        if (document.querySelector('.hero-img')) {
            const timeline = gsap.timeline();
            timeline.from('.hero-img', { scale: 1.2, duration: 2, ease: 'power2.out' })
                .from('.hero-title span', { y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: 'power4.out' }, '-=1.5')
                .from('.cta-button', { y: 20, opacity: 0, duration: 1 }, '-=1')
                .from('.scroll-indicator', { opacity: 0, duration: 1 }, '-=0.5');
        }

        // Navbar Scroll
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            toggleClass: { className: 'scrolled', targets: '.navbar' }
        });

        // Collection Scroll Trigger
        if (document.querySelector('.product-card')) {
            gsap.from('.product-card', {
                scrollTrigger: {
                    trigger: '.products-grid',
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }

        // Scroll Progress Bar
        if (document.querySelector('.scroll-progress')) {
            gsap.to('.scroll-progress', {
                width: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.3
                }
            });
        }

        // Initial UI Update
        updateCartUI();
    }

    // --- Preloader (Improved) ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        const loaderBar = document.querySelector('.loader-bar');
        setTimeout(() => { if (loaderBar) loaderBar.style.width = '100%'; }, 500);
        setTimeout(() => {
            gsap.to(preloader, {
                y: '-100%',
                duration: 1,
                ease: 'power4.inOut',
                onComplete: initAnimations
            });
        }, 2000);
    } else {
        // Fallback if no preloader (like simple pages)
        initAnimations();
    }

    // Handle initial state if no preloader
    updateCartUI();
});

