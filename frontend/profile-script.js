// Данные товаров для избранного
const products = [
    {
        id: 1,
        name: "Château Margaux 2015",
        categoryName: "Вино",
        price: 45000,
        image: "https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=400&q=80"
    },
    {
        id: 2,
        name: "Macallan 18 Years",
        categoryName: "Виски",
        price: 32000,
        image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80"
    },
    {
        id: 4,
        name: "Hennessy XO",
        categoryName: "Коньяк",
        price: 28000,
        image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80"
    },
    {
        id: 5,
        name: "Dom Pérignon 2012",
        categoryName: "Шампанское",
        price: 35000,
        image: "https://images.unsplash.com/photo-1594149929911-78975a43d4f5?w=400&q=80"
    },
    {
        id: 7,
        name: "Glenfiddich 21 Year",
        categoryName: "Виски",
        price: 42000,
        image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80"
    }
];

// Проверка авторизации
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
    }
    
    setupNavigation();
    loadFavorites();
});

// Навигация по разделам
function setupNavigation() {
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchTab(section);
        });
    });

    // Проверка хэша при загрузке
    const hash = window.location.hash.slice(1) || 'dashboard';
    switchTab(hash);
}

function switchTab(section) {
    // Обновление активной ссылки
    document.querySelectorAll('.profile-nav a').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.profile-nav a[data-section="${section}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    // Показ секции
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    const activeSection = document.getElementById(section);
    if (activeSection) activeSection.classList.add('active');
    
    // Обновление URL
    history.pushState(null, null, `#${section}`);
}

// Выход
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Загрузка избранного
function loadFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    favoritesGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image" style="height: 250px;">
                <img src="${product.image}" alt="${product.name}">
                <button class="remove-favorite" onclick="removeFavorite(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.categoryName}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-footer">
                    <span class="product-price">${product.price.toLocaleString()} ₽</span>
                    <button class="add-to-cart-btn" onclick="addToCartFromFavorites(${product.id})">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function removeFavorite(btn) {
    event.stopPropagation();
    const card = btn.closest('.product-card');
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    setTimeout(() => card.remove(), 300);
}

function addToCartFromFavorites(productId) {
    // Добавление в корзину из избранного
    const product = products.find(p => p.id === productId);
    let cart = JSON.parse(localStorage.getItem('wineCart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('wineCart', JSON.stringify(cart));
    
    // Уведомление
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.innerHTML = '<i class="fas fa-check-circle"></i><span>Товар добавлен в корзину</span>';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Открытие модалки адреса
function openAddressModal() {
    alert('Модальное окно добавления адреса');
}