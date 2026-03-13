// Данные товаров
const products = [
    {
        id: 1,
        name: "Château Margaux 2015",
        category: "wine",
        categoryName: "Вино",
        price: 45000,
        rating: 4.9,
        volume: "0.75л",
        country: "Франция",
        image: "https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=400&q=80",
        badge: "Хит",
        popular: true
    },
    {
        id: 2,
        name: "Macallan 18 Years",
        category: "whiskey",
        categoryName: "Виски",
        price: 32000,
        rating: 4.8,
        volume: "0.7л",
        country: "Шотландия",
        image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80",
        badge: "Премиум",
        popular: true
    },
    {
        id: 3,
        name: "Beluga Gold Line",
        category: "vodka",
        categoryName: "Водка",
        price: 8500,
        rating: 4.7,
        volume: "1л",
        country: "Россия",
        image: "https://images.unsplash.com/photo-1614313511387-1435a9731c5e?w=400&q=80",
        badge: null,
        popular: false
    },
    {
        id: 4,
        name: "Hennessy XO",
        category: "cognac",
        categoryName: "Коньяк",
        price: 28000,
        rating: 4.9,
        volume: "0.7л",
        country: "Франция",
        image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80",
        badge: "Топ",
        popular: true
    },
    {
        id: 5,
        name: "Dom Pérignon 2012",
        category: "champagne",
        categoryName: "Шампанское",
        price: 35000,
        rating: 4.8,
        volume: "0.75л",
        country: "Франция",
        image: "https://images.unsplash.com/photo-1594149929911-78975a43d4f5?w=400&q=80",
        badge: "Новинка",
        popular: true
    },
    {
        id: 6,
        name: "Sassicaia 2018",
        category: "wine",
        categoryName: "Вино",
        price: 38000,
        rating: 4.7,
        volume: "0.75л",
        country: "Италия",
        image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80",
        badge: null,
        popular: false
    },
    {
        id: 7,
        name: "Glenfiddich 21 Year",
        category: "whiskey",
        categoryName: "Виски",
        price: 42000,
        rating: 4.9,
        volume: "0.7л",
        country: "Шотландия",
        image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80",
        badge: "Редкость",
        popular: true
    },
    {
        id: 8,
        name: "Krug Grande Cuvée",
        category: "champagne",
        categoryName: "Шампанское",
        price: 55000,
        rating: 5.0,
        volume: "0.75л",
        country: "Франция",
        image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400&q=80",
        badge: "Лучшее",
        popular: true
    }
];

// Корзина и авторизация
let cart = [];
let isLoggedIn = false;

// DOM элементы
const productsGrid = document.getElementById('productsGrid');
const popularGrid = document.getElementById('popularGrid');
const cartBtn = document.getElementById('cartBtn');
const cartDropdown = document.getElementById('cartDropdown');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const searchToggle = document.getElementById('searchToggle');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearch = document.getElementById('closeSearch');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const notification = document.getElementById('notification');
const header = document.getElementById('header');
const authModal = document.getElementById('authModal');
const closeAuth = document.getElementById('closeAuth');
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts(products);
    renderPopular();
    setupEventListeners();
    checkAuthStatus();
});

// Проверка авторизации
function checkAuthStatus() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        isLoggedIn = true;
        updateProfileUI();
    }
}

// Обновление UI профиля
function updateProfileUI() {
    if (isLoggedIn) {
        profileBtn.innerHTML = '<i class="fas fa-user-check"></i>';
        profileBtn.style.color = 'var(--accent)';
    } else {
        profileBtn.innerHTML = '<i class="fas fa-user"></i>';
        profileBtn.style.color = '';
    }
}

// Рендер товаров с кнопкой снизу
function renderProducts(items) {
    productsGrid.innerHTML = items.map(product => `
        <div class="product-card ${cart.find(item => item.id === product.id) ? 'in-cart' : ''}" data-id="${product.id}">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-category">${product.categoryName}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-meta">
                    <span>${product.country} • ${product.volume}</span>
                    <span class="product-rating"><i class="fas fa-star"></i> ${product.rating}</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">${product.price.toLocaleString()} ₽</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, this)">
                        <i class="fas fa-shopping-bag"></i>
                        <span>В корзину</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Рендер популярных
function renderPopular() {
    const popularProducts = products.filter(p => p.popular).slice(0, 4);
    popularGrid.innerHTML = popularProducts.map(product => `
        <div class="popular-card" onclick="addToCart(${product.id})">
            <img src="${product.image}" alt="${product.name}">
            <div class="popular-overlay">
                <h3>${product.name}</h3>
                <p>${product.categoryName} • ${product.price.toLocaleString()} ₽</p>
            </div>
        </div>
    `).join('');
}

// Добавление в корзину
function addToCart(productId, btnElement) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCart();
    showNotification();
    updateCartUI();
    
    // Анимация кнопки
    if (btnElement) {
        btnElement.classList.add('added');
        btnElement.innerHTML = '<i class="fas fa-check"></i><span>Добавлено</span>';
        setTimeout(() => {
            btnElement.classList.remove('added');
            btnElement.innerHTML = '<i class="fas fa-shopping-bag"></i><span>В корзину</span>';
        }, 1500);
    }
    
    // Анимация корзины
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
}

// Обновление корзины
function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toLocaleString() + ' ₽';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽ × ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

// Обновление UI карточек товаров
function updateCartUI() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.id);
        if (cart.find(item => item.id === productId)) {
            card.classList.add('in-cart');
        } else {
            card.classList.remove('in-cart');
        }
    });
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
    updateCartUI();
}

// Сохранение/загрузка корзины
function saveCart() {
    localStorage.setItem('wineCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('wineCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

// Уведомление
function showNotification() {
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// Фильтрация
function filterProducts(category) {
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    renderProducts(filtered);
}

// Сортировка
function sortProducts(method) {
    let sorted = [...products];
    
    switch(method) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    renderProducts(sorted);
}

// Поиск
function searchProducts(query) {
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(query.toLowerCase()) ||
        p.country.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filtered);
}

// Auth функции
function openAuth() {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(tab === 'login' ? 'loginForm' : 'registerForm').classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
    updateProfileUI();
    closeAuthModal();
    showNotificationMessage('Вы успешно вошли!');
    
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();
    isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
    updateProfileUI();
    closeAuthModal();
    showNotificationMessage('Регистрация успешна!');
    
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1000);
}

function showNotificationMessage(msg) {
    notification.querySelector('span').textContent = msg;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
        notification.querySelector('span').textContent = 'Товар добавлен в корзину';
    }, 3000);
}

// Event Listeners
function setupEventListeners() {
    // Корзина
    cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cartDropdown.classList.toggle('active');
        profileDropdown.classList.remove('active');
    });
    
    closeCart.addEventListener('click', () => {
        cartDropdown.classList.remove('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
        if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });
    
    // Поиск
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });
    
    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });
    
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
    
    // Фильтры
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.filter);
        });
    });
    
    // Сортировка
    sortSelect.addEventListener('change', (e) => {
        sortProducts(e.target.value);
    });
    
    // Скролл шапки
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Плавный скролл
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    mobileMenuBtn.addEventListener('click', () => {
        alert('Мобильное меню в разработке');
    });

    // Auth события
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isLoggedIn) {
            profileDropdown.classList.toggle('active');
            cartDropdown.classList.remove('active');
        } else {
            openAuth();
        }
    });

    closeAuth.addEventListener('click', closeAuthModal);
    
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });

    // Табы авторизации
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchAuthTab(tab.dataset.tab);
        });
    });

    // Формы
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Показать/скрыть пароль
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            input.type = input.type === 'password' ? 'text' : 'password';
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });

    // Выход
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        updateProfileUI();
        profileDropdown.classList.remove('active');
        showNotificationMessage('Вы вышли из аккаунта');
    });
}