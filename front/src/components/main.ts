import { Component } from "../utils/Component";
import { Product } from "../interface/Product";
import { ProductService } from "../api/product";
import {router} from "../utils/router/router-instance"

interface MainState {
    products: Product[];
    isLoggedIn: boolean;
    isSearchOpen: boolean;
    isProfileOpen: boolean;
}

export class Main extends Component<MainState> {
    constructor() {
        super("div", {
            products: [],
            isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
            isSearchOpen: false,
            isProfileOpen: false
        }, "page-wrapper");

        this.applyStyles("main-styles", this.buildStyles());
        this.loadProducts();
    }

    private async loadProducts() {
        const products = await ProductService.getAll();
        this.state.products = products; 
        this.updateCatalog(products);
    }

    // ====================== СТИЛИ ======================
    private buildStyles(): string {
        return `
:root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #141414;
    --bg-card: #1a1a1a;
    --bg-hover: #252525;
    --accent: #ff6b35;
    --accent-hover: #ff8555;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --text-muted: #666666;
    --border: #2a2a2a;
    --success: #4caf50;
    --gradient: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    --shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html { scroll-behavior: smooth; }

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}

h1, h2, h3, h4 {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
}

.section-title {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.section-subtitle {
    color: var(--text-secondary);
    font-size: 1.1rem;
}

/* Header */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: var(--text-primary);
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
}

.logo i {
    color: var(--accent);
    font-size: 1.6rem;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 30px;
}

.nav-links a {
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.95rem;
    position: relative;
}

.nav-links a:hover {
    color: var(--text-primary);
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.login-btn, .register-btn {
    padding: 10px 24px;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    border: 1px solid transparent;
}

.login-btn {
    background: transparent;
    color: var(--text-primary);
    border-color: var(--border);
}

.login-btn:hover {
    background: var(--bg-hover);
    border-color: var(--text-secondary);
    transform: translateY(-1px);
}

.register-btn {
    background: var(--gradient);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.register-btn:hover {
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
    transform: translateY(-1px);
    filter: brightness(1.1);
}

.register-btn:active, .login-btn:active {
    transform: translateY(0);
}

@media (max-width: 768px) {
    .login-btn, .register-btn {
        padding: 8px 16px;
        font-size: 0.8rem;
    }
}

.cart-btn {
    position: relative; /* Чтобы позиционировать бейдж */
}

.cart-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: var(--accent);
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--bg-primary);
}

.search-btn, .profile-btn, .cart-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.search-btn:hover, .profile-btn:hover, .cart-btn:hover {
    color: var(--accent);
    background: var(--bg-hover);
}

/* Profile dropdown */
.profile-wrapper { position: relative; }

.profile-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 12px;
    width: 260px;
    background: var(--bg-secondary);
    border-radius: 18px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: var(--transition);
    z-index: 1001;
}

.profile-dropdown.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.profile-header {
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--border);
}

.profile-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.profile-info h4 {
    font-size: 0.95rem;
}

.profile-info span {
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.profile-menu {
    list-style: none;
    padding: 10px 0;
}

.profile-menu li a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 18px;
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.profile-menu li a:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.profile-menu .divider {
    height: 1px;
    background: var(--border);
    margin: 6px 0;
}

/* Search panel */
.search-overlay {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background: var(--bg-secondary);
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: var(--transition);
    z-index: 900;
}

.search-overlay.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.search-container {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    padding: 0 20px;
}

.search-container input {
    width: 100%;
    padding: 12px 40px 12px 14px;
    background: var(--bg-card);
    border-radius: 10px;
    border: 1px solid var(--border);
    color: var(--text-primary);
}

.close-search {
    position: absolute;
    right: 28px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
}

/* Hero */
.hero {
    height: 100vh;
    background: linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.9)),
                url('https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1920&q=80') center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    padding-top: 80px;
}

.hero-content {
    max-width: 800px;
    padding: 0 20px;
}

.hero-title {
    font-size: 3.5rem;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

.hero-btn {
    display: inline-block;
    padding: 14px 32px;
    background: var(--gradient);
    color: white;
    text-decoration: none;
    border-radius: 30px;
    font-weight: 600;
}

/* Catalog */
.catalog {
    padding: 90px 0;
    background: var(--bg-primary);
}

.section-header {
    text-align: center;
    margin-bottom: 40px;
}

.controls-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    gap: 20px;
    flex-wrap: wrap;
}

.filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 8px 18px;
    background: var(--bg-card);
    border-radius: 20px;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.9rem;
}

.filter-btn.active,
.filter-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
}

.sort-select {
    padding: 10px 16px;
    background: var(--bg-card);
    border-radius: 10px;
    border: 1px solid var(--border);
    color: var(--text-primary);
}

/* Products grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
}

.product-card {
    background: var(--bg-card);
    border-radius: 18px;
    border: 1px solid var(--border);
    overflow: hidden;
    position: relative;
    transition: var(--transition);
}

.product-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow);
    border-color: var(--accent);
}

.product-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: var(--accent);
    color: white;
    padding: 4px 10px;
    border-radius: 14px;
    font-size: 0.75rem;
}

.product-image {
    height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1f1f1f;
}

.product-image img {
    max-height: 80%;
    width: auto;
    object-fit: contain;
}

.product-info {
    padding: 16px;
}

.product-category {
    color: var(--accent);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
}

.product-title {
    font-size: 1rem;
    margin-bottom: 8px;
}

.product-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 10px;
}

.product-rating {
    color: #ffc107;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border);
    padding-top: 10px;
    gap: 10px;
}

.product-price {
    font-size: 1.1rem;
    font-weight: 700;
}

.add-to-cart-btn {
    flex: 1;
    padding: 10px 14px;
    background: var(--accent);
    border-radius: 10px;
    border: none;
    color: white;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
}

/* Popular */
.popular {
    padding: 80px 0;
    background: var(--bg-secondary);
}

.popular-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
}

.popular-card {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
}

.popular-card img {
    width: 100%;
    height: 320px;
    object-fit: cover;
}

.popular-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.9));
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 16px;
}

/* About */
.about {
    padding: 90px 0;
    background: var(--bg-primary);
}

.about-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 50px;
    align-items: center;
}

.image-wrapper {
    border-radius: 18px;
    overflow: hidden;
    box-shadow: var(--shadow);
}

.image-wrapper img {
    width: 100%;
    display: block;
}

.about-text {
    color: var(--text-secondary);
    margin-bottom: 24px;
}

.features {
    display: grid;
    gap: 10px;
}

.feature {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-primary);
}

/* Benefits */
.benefits {
    padding: 70px 0;
    background: var(--bg-secondary);
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
}

.benefit-card {
    background: var(--bg-card);
    border-radius: 18px;
    border: 1px solid var(--border);
    padding: 24px;
    text-align: center;
}

/* Footer */
.footer {
    padding: 60px 0 30px;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 40px;
    margin-bottom: 30px;
}

.footer-bottom {
    border-top: 1px solid var(--border);
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
    color: var(--text-muted);
    font-size: 0.85rem;
}
    /* ====================== СТИЛИ ФУТЕРА ====================== */

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr; /* Пропорции как в вашем коде */
    gap: 40px;
    margin-bottom: 40px;
}

.footer-links h4 {
    color: var(--text-primary);
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    margin-bottom: 20px;
    position: relative;
}

.footer-links h4::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 30px;
    height: 2px;
    background: var(--accent);
}

.footer-links ul {
    list-style: none;
    padding: 0;
}

.footer-links ul li {
    margin-bottom: 12px;
}

.footer-links ul li a {
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.95rem;
    transition: var(--transition);
    display: inline-block;
}

.footer-links ul li a:hover {
    color: var(--accent);
    transform: translateX(5px); /* Легкий сдвиг вправо */
}

.footer-links ul li i {
    color: var(--accent);
    margin-right: 10px;
    width: 16px;
    text-align: center;
}

.footer-brand p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-top: 20px;
    max-width: 300px;
}

@media (max-width: 992px) {
    .footer-grid {
        grid-template-columns: 1fr 1fr; /* 2 колонки на планшетах */
    }
}

@media (max-width: 576px) {
    .footer-grid {
        grid-template-columns: 1fr; /* 1 колонка на телефонах */
        gap: 30px;
    }
    
    .footer-links h4 {
        margin-bottom: 15px;
    }
}
        `;
    }

    // ====================== РЕНДЕР ======================
    render(): string {
        return `
            ${this.renderHeader()}
            ${this.renderSearchPanel()}
            ${this.renderHero()}
            ${this.renderCatalog()}
            ${this.renderPopular()}
            ${this.renderAbout()}
            ${this.renderBenefits()}
            ${this.renderFooter()}
        `;
    }

    // ====================== afterRender ======================
    protected addMove(): void {
        this.attachSearchEvents();
        this.attachProfileEvents();
        this.attachFilters();
        this.attachSort();
        this.attachSearchInput();
        this.attachCartButton();
        this.attachAuthNavigation();
        this.updateCatalog(this.state.products);
    }

    // ====================== ХЕДЕР ======================
    private renderHeader(): string {
        return `
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <a href="/" class="logo">
                        <i class="fas fa-wine-bottle"></i>
                        <span>Wine & Spirits</span>
                    </a>

                    <ul class="nav-links">
                        <li><a href="catalog">Каталог</a></li>
                        <li><a href="popular">Популярное</a></li>
                        <li><a href="about">О нас</a></li>
                        <li><a href="contacts">Контакты</a></li>
                    </ul>

                    <div class="header-actions">
                        <button class="search-btn" id="searchToggle">
                            <i class="fas fa-search"></i>
                        </button>

                        ${!this.state.isLoggedIn ? `
                            <button class="login-btn" id="loginBtn">Войти</button>
                            <button class="register-btn" id="registerBtn">Регистрация</button>
                        ` : ""}     

                        <div class="profile-wrapper">
                            <button class="profile-btn" id="profileBtn">
                                <i class="fas fa-user"></i>
                            </button>

                            <div class="profile-dropdown" id="profileDropdown">
                                <div class="profile-header">
                                    <div class="profile-avatar">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div class="profile-info">
                                        <h4>Пользователь</h4>
                                        <span>${localStorage.getItem("userEmail") || "email@example.com"}</span>
                                    </div>
                                </div>

                                <ul class="profile-menu">
                                    <li><a href="#"><i class="fas fa-user-circle"></i> Личный кабинет</a></li>
                                    <li class="divider"></li>
                                    <li><a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Выйти</a></li>
                                </ul>
                            </div>
                        </div>

                        ${this.state.isLoggedIn ? `
                        <button class="cart-btn" id="cartBtn">
                            <i class="fas fa-shopping-bag"></i>
                            <span class="cart-badge">0</span> 
                        </button>    ` : ""}
                    </div>
                </nav>
            </div>
        </header>
        `;
    }

    // ====================== ПОИСК ======================
    private renderSearchPanel(): string {
        return `
        <div class="search-overlay ${this.state.isSearchOpen ? "active" : ""}" id="searchOverlay">
            <div class="search-container">
                <input type="text" placeholder="Поиск по стране названию категории" id="searchInput">
                <button class="close-search" id="closeSearch"><i class="fas fa-times"></i></button>
            </div>
        </div>
        `;
    }

    // ====================== HERO ======================
    private renderHero(): string {
        return `
        <section class="hero">
            <div class="hero-content">
                <h1 class="hero-title">Премиальный алкоголь<br>для особых моментов</h1>
                <p class="hero-subtitle">Коллекция лучших вин, виски и крепких напитков со всего мира</p>
                <a href="#catalog" class="hero-btn">Смотреть каталог</a>
            </div>
        </section>
        `;
    }

    // ====================== КАТАЛОГ ======================
    private renderCatalog(): string {
        return `
        <section class="catalog" id="catalog">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Каталог</h2>
                    <p class="section-subtitle">Выберите идеальный напиток</p>
                </div>

                <div class="controls-bar">
                    <div class="filters">
                        <button class="filter-btn active" data-filter="all">Все</button>
                        <button class="filter-btn" data-filter="Вино">Вино</button>
                        <button class="filter-btn" data-filter="Виски">Виски</button>
                        <button class="filter-btn" data-filter="Водка">Водка</button>
                        <button class="filter-btn" data-filter="Коньяк">Коньяк</button>
                        <button class="filter-btn" data-filter="Шампанское">Шампанское</button>
                    </div>

                    <select class="sort-select" id="sortSelect">
                        <option value="default">Сортировка</option>
                        <option value="price-asc">Цена ↑</option>
                        <option value="price-desc">Цена ↓</option>
                        <option value="name">Название</option>
                        <option value="rating">Рейтинг</option>
                    </select>
                </div>

                <div class="products-grid"></div>
            </div>
        </section>
        `;
    }
    
    private updateCatalog(products: Product[]) {
        const grid = this.element.querySelector(".products-grid");
        if (!grid) return;

        grid.innerHTML = products.map(p =>
            `<div class="product-card">
                <div class="product-image">
                    <img src="${p.image}" alt="${p.name}" >
                </div>
                <div class="product-info">
                    <div class="product-category">${p.categoryName}</div>
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-meta">
                        <span>${p.country} • ${p.volume}</span>
                        <span class="product-rating"><i class="fas fa-star"></i> ${p.rating}</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${p.price.toLocaleString()} ₽</span>
                        <button class="add-to-cart-btn">
                            <i class="fas fa-shopping-bag"></i>
                            <span>В корзину</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    // ====================== POPULAR ======================
    private renderPopular(): string {
        return `
        <section class="popular" id="popular">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Популярное</h2>
                    <p class="section-subtitle">То, что выбирают наши клиенты</p>
                </div>

                <div class="popular-grid">
                    ${this.state.products
                        .filter(p => p.popular)
                        .slice(0, 4)
                        .map(p => `
                            <div class="popular-card">
                                <img src="${p.image}" alt="${p.name}">
                                <div class="popular-overlay">
                                    <h3>${p.name}</h3>
                                    <p>${p.categoryName} • ${p.price.toLocaleString()} ₽</p>
                                </div>
                            </div>
                        `).join("")}
                </div>
            </div>
        </section>
        `;
    }

    // ====================== ABOUT ======================
    private renderAbout(): string {
        return `
        <section class="about" id="about">
            <div class="container">
                <div class="about-grid">
                    <div class="about-image">
                        <div class="image-wrapper">
                            <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80" alt="Wine cellar">
                        </div>
                    </div>
                    <div class="about-content">
                        <h2 class="section-title">О нашем магазине</h2>
                        <p class="about-text">
                            Мы специализируемся на премиальном алкоголе с 2015 года. Наша команда сомелье отбирает лучшие образцы из более чем 20 стран мира.
                        </p>
                        <div class="features">
                            <div class="feature">
                                <i class="fas fa-check-circle"></i>
                                <span>Гарантия подлинности</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-truck"></i>
                                <span>Доставка от 30 минут</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-undo"></i>
                                <span>Возврат в течение 14 дней</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-headset"></i>
                                <span>Персональный консультант</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `;
    }

    // ====================== BENEFITS ======================
    private renderBenefits(): string {
        return `
        <section class="benefits">
            <div class="container">
                <div class="benefits-grid">
                    <div class="benefit-card">
                        <i class="fas fa-award"></i>
                        <h3>Только оригинал</h3>
                        <p>Прямые поставки от производителей</p>
                    </div>
                    <div class="benefit-card">
                        <i class="fas fa-temperature-low"></i>
                        <h3>Оптимальные условия</h3>
                        <p>Соблюдение температурного режима</p>
                    </div>
                    <div class="benefit-card">
                        <i class="fas fa-gift"></i>
                        <h3>Подарочная упаковка</h3>
                        <p>Бесплатно при заказе от 5000 ₽</p>
                    </div>
                    <div class="benefit-card">
                        <i class="fas fa-shield-alt"></i>
                        <h3>Безопасная оплата</h3>
                        <p>Защита данных покупателей</p>
                    </div>
                </div>
            </div>
        </section>
        `;
    }

    // ====================== FOOTER ======================
    private renderFooter(): string {
        return `
        <footer class="footer" id="contacts">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-brand">
                        <a href="/" class="logo">
                            <i class="fas fa-wine-bottle"></i>
                            <span>Wine & Spirits</span>
                        </a>
                        <p>Премиальный алкоголь для ценителей. Только лучшие напитки со всего мира.</p>
                    </div>

                    <div class="footer-links">
                        <h4>Навигация</h4>
                        <ul>
                            <li><a href="#catalog">Каталог</a></li>
                            <li><a href="#popular">Популярное</a></li>
                            <li><a href="#about">О нас</a></li>
                        </ul>
                    </div>

                    <div class="footer-links">
                        <h4>Информация</h4>
                        <ul>
                            <li><a href="#">Доставка</a></li>
                            <li><a href="#">Оплата</a></li>
                            <li><a href="#">Возврат</a></li>
                        </ul>
                    </div>

                    <div class="footer-links">
                        <h4>Контакты</h4>
                        <ul>
                            <li><a href="tel:+79999999999">+7 (999) 999-99-99</a></li>
                            <li><a href="mailto:info@example.com">info@example.com</a></li>
                            <li><a href="#">г. Москва, ул. Примерная, 1</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <span>© ${new Date().getFullYear()} Wine & Spirits</span>
                    <span>18+ Продажа алкоголя только совершеннолетним</span>
                </div>
            </div>
        </footer>
        `;
    }

    // ====================== СОБЫТИЯ ======================
    private attachAuthNavigation() {
        const login = this.element.querySelector(".login-btn");
        const register = this.element.querySelector(".register-btn");

        login?.addEventListener("click", () => {
            router.navigate("/login");
        });

        register?.addEventListener("click", () => {
            router.navigate("/register");
        });
    }

    private attachSearchEvents() {
        const toggle = this.element.querySelector("#searchToggle");
        const close = this.element.querySelector("#closeSearch");
        const overlay = this.element.querySelector("#searchOverlay");

        toggle?.addEventListener("click", () => {
            this.setState({ isSearchOpen: !this.state.isSearchOpen });
        });

        close?.addEventListener("click", () => {
            this.setState({ isSearchOpen: false });
        });

        overlay?.addEventListener("click", (e) => {
            if (e.target === overlay) this.setState({ isSearchOpen: false });
        });
    }

    private attachProfileEvents() {
        const btn = this.element.querySelector("#profileBtn");
        const dropdown = this.element.querySelector("#profileDropdown");
        const logout = this.element.querySelector("#logoutBtn");

        btn?.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!this.state.isLoggedIn) return;
            this.setState({ isProfileOpen: !this.state.isProfileOpen });
            dropdown?.classList.toggle("active", this.state.isProfileOpen);
        });

        logout?.addEventListener("click", () => {
            localStorage.removeItem("isLoggedIn");
            window.location.reload();
        });

        document.addEventListener("click", (e) => {
            if (!dropdown) return;
            if (!dropdown.contains(e.target as Node) && !btn?.contains(e.target as Node)) {
                dropdown.classList.remove("active");
                this.state.isProfileOpen = false;
            }
        });
    }

    private attachFilters() {
        this.element.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                this.element.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.getAttribute("data-filter") || "all";

                let products = await ProductService.getAll();
                if (filter !== "all") {
                    products = products.filter(p => p.categoryName === filter);
                }

                this.updateCatalog(products);
            });
        });
    }

    private attachSort() {
        const select = this.element.querySelector("#sortSelect") as HTMLSelectElement | null;
        if (!select) return;

        select.addEventListener("change", () => {
            let products = [...this.state.products];

            switch (select.value) {
                case "price-asc":
                    products.sort((a, b) => a.price - b.price);
                    break;
                case "price-desc":
                    products.sort((a, b) => b.price - a.price);
                    break;
                case "name":
                    products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "rating":
                    products.sort((a, b) => b.rating - a.rating);
                    break;
            }

            this.updateCatalog(products);
        });
    }

    private attachSearchInput() {
        const input = this.element.querySelector("#searchInput") as HTMLInputElement | null;
        if (!input) return;

        input.addEventListener("input", () => {
            const q = input.value.toLowerCase();

            const filtered = this.state.products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.categoryName.toLowerCase().includes(q) ||
                p.country.toLowerCase().includes(q)
            );

            this.updateCatalog(filtered);
        });
    }

    private attachCartButton() {
        const cartBtn = this.element.querySelector("#cartBtn");
        cartBtn?.addEventListener("click", () => {
            if (!this.state.isLoggedIn) {
                window.location.href = "/auth";
                return;
            }
            window.location.href = "/cart";
        });
    }
}
