import { Component } from "../utils/Component/Component";
import { Product } from "../interface/Product";
import { CartItem, User } from "../interface/User";
import { hasAuthHint, UserService } from "../api/user";
import { ProductService } from "../api/product";
import { router } from "../utils/router/router-instance";

interface MainState {
    products: Product[];
    isLoggedIn: boolean;
    currentUser: User | null;
}

type ProductSort = "default" | "price-asc" | "price-desc" | "name" | "rating";
type ProductAvailability = "all" | "true" | "false";

export class Main extends Component<MainState> {
    private activeFilter = "all";
    private activeAvailability: ProductAvailability = "all";
    private activeSort: ProductSort = "default";
    private searchQuery = "";
    private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    private isDocumentClickBound = false;

    constructor() {
        super("div", {
            products: [],
            isLoggedIn: false,
            currentUser: null
        }, "page-wrapper");

        this.applyStyles("main-styles", this.buildStyles());
        void this.init();
    }

    private async init(): Promise<void> {
        const [productsResult, userResult] = await Promise.allSettled([
            ProductService.getAll(),
            this.loadCurrentUser()
        ]);

        const products = productsResult.status === "fulfilled" ? productsResult.value : [];
        if (productsResult.status === "rejected") {
            console.error("Failed to load products", productsResult.reason);
        }

        const currentUser = userResult.status === "fulfilled" ? userResult.value : null;
        if (userResult.status === "rejected") {
            console.error("Failed to load current user", userResult.reason);
        }

        this.setState({
            products,
            currentUser,
            isLoggedIn: Boolean(currentUser)
        });
    }

    private async loadCurrentUser(): Promise<User | null> {
        if (!hasAuthHint()) {
            return null;
        }

        try {
            return await UserService.getCurrent();
        } catch (error) {
            console.error("Failed to load current user", error);
            return null;
        }
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
    position: fixed;
    top: 80px;          /* под хедером */
    left: 0;
    right: 0;
    background: var(--bg-secondary);
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: var(--transition);
    z-index: 900;       /* ниже хедера, выше контента */
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
    display: flex;
    flex-direction: column;
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
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
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
    line-height: 1.35;
    min-height: 2.7em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-description {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.4;
    min-height: 2.8em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--text-secondary);
    min-height: 1.4em;
}

.product-rating {
    color: #ffc107;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border);
    padding-top: 12px;
    margin-top: auto;
    gap: 10px;
    flex-wrap: wrap;
}

.product-price {
    font-size: 1.1rem;
    font-weight: 700;
}

.stock-badge {
    font-size: 0.75rem;
    padding: 5px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    background: rgba(20, 20, 20, 0.5);
    align-self: flex-start;
    margin-bottom: 2px;
}

.stock-badge.in-stock {
    color: #8ff0a4;
    border-color: #2f8f46;
}

.stock-badge.out-of-stock {
    color: #ff9f9f;
    border-color: #9c4242;
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

.add-to-cart-btn:disabled {
    background: #555;
    cursor: not-allowed;
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

.footer-3col {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr; /* бренд + два блока справа */
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
        this.attachOutsideClickHandler();
        this.attachFilters();
        this.attachAvailabilitySelect();
        this.attachSort();
        this.attachSearchInput();
        this.attachAuthNavigation();
        this.attachAddToCartHandlers();
        this.refreshCatalog();
        this.updateCartBadge();
    }

    protected beforeUnmount(): void {
        if (this.isDocumentClickBound) {
            document.removeEventListener("click", this.handleDocumentClick);
            this.isDocumentClickBound = false;
        }

        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
            this.searchDebounceTimer = null;
        }
    }


    // ====================== ХЕДЕР ======================
    private renderHeader(): string {
    const user = this.state.currentUser;
    const userName = user?.name || "Гость";
    const userEmail = user?.email || "Войдите в аккаунт";
    const cartCount = this.getCartCount();

    return `
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="/" class="logo">
                    <i class="fas fa-wine-bottle"></i>
                    <span>Wine & Spirits</span>
                </a>

                <ul class="nav-links">
                    <li><a href="/#catalog">Каталог</a></li>
                    <li><a href="/#popular">Популярное</a></li>
                    <li><a href="/#about">О нас</a></li>
                    <li><a href="/#contacts">Контакты</a></li>
                </ul>

                <div class="header-actions">
                    <button class="search-btn ui-btn ui-btn--secondary ui-btn--icon" id="searchToggle">
                        <i class="fas fa-search"></i>
                    </button>

                    ${!this.state.isLoggedIn ? `
                        <button class="login-btn ui-btn ui-btn--secondary" id="loginBtn">Войти</button>
                        <button class="register-btn ui-btn ui-btn--primary" id="registerBtn">Регистрация</button>
                    ` : ""}     

                    <div class="profile-wrapper">
                        <button class="profile-btn ui-btn ui-btn--secondary ui-btn--icon" id="profileBtn">
                            <i class="fas fa-user"></i>
                        </button>

                        <div class="profile-dropdown" id="profileDropdown">
                            <div class="profile-header">
                                <div class="profile-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="profile-info">
                                    <h4>${userName}</h4>
                                    <span>${userEmail}</span>
                                </div>
                            </div>

                            <ul class="profile-menu">
                                <li><a href="#" id="goProfile"><i class="fas fa-user-circle"></i> Личный кабинет</a></li>
                                <li><a href="#" id="goCheckout"><i class="fas fa-shopping-bag"></i> Корзина: ${cartCount}</a></li>
                                <li class="divider"></li>
                                <li><a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Выйти</a></li>
                            </ul>
                        </div>
                    </div>

                    ${this.state.isLoggedIn ? `
                    <button class="cart-btn ui-btn ui-btn--secondary ui-btn--icon" id="cartBtn">
                    <i class="fas fa-shopping-bag"></i>
                        <span class="cart-badge">${cartCount}</span> 
                    </button>
` : ""}
                </div>
            </nav>
        </div>
    </header>
    `;
}


    // ====================== ПОИСК ======================
    private renderSearchPanel(): string {
    return `
        <div class="search-overlay" id="searchOverlay">
            <div class="search-container">
                <input type="text" placeholder="Поиск по стране названию категории" id="searchInput">
                <button class="close-search ui-btn ui-btn--secondary ui-btn--icon" id="closeSearch"><i class="fas fa-times"></i></button>
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
                        <button class="filter-btn ui-btn ui-btn--secondary active" data-filter="all">Все</button>
                        <button class="filter-btn ui-btn ui-btn--secondary" data-filter="Вино">Вино</button>
                        <button class="filter-btn ui-btn ui-btn--secondary" data-filter="Виски">Виски</button>
                        <button class="filter-btn ui-btn ui-btn--secondary" data-filter="Водка">Водка</button>
                        <button class="filter-btn ui-btn ui-btn--secondary" data-filter="Коньяк">Коньяк</button>
                        <button class="filter-btn ui-btn ui-btn--secondary" data-filter="Шампанское">Шампанское</button>
                    </div>

                    <select class="sort-select" id="availabilitySelect">
                        <option value="all">Наличие: любое</option>
                        <option value="true">Только в наличии</option>
                        <option value="false">Только отсутствующие</option>
                    </select>

                    <select class="sort-select" id="sortSelect">
                        <option value="default">Сортировка</option>
                        <option value="price-asc">Дёшево</option>
                        <option value="price-desc">Дорого</option>
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
                    <span class="stock-badge ${p.inStock ? "in-stock" : "out-of-stock"}">${p.inStock ? "В наличии" : "Нет в наличии"}</span>
                    <div class="product-category">${p.categoryName}</div>
                    <h3 class="product-title" data-title>${p.name}</h3>
                    <p class="product-description">${p.description}</p>
                    <div class="product-meta">
                        <span>${p.country} • ${p.volume}</span>
                        <span class="product-rating"><i class="fas fa-star"></i> ${p.rating}</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price" data-price>${p.price.toLocaleString()} ₽</span>
                        <button class="add-to-cart-btn ui-btn ui-btn--primary" data-id="${p.id}" ${p.inStock ? "" : "disabled"}>
                            <i class="fas fa-shopping-bag"></i>
                            <span>${p.inStock ? "В корзину" : "Недоступно"}</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    private matchesActiveFilter(product: Product): boolean {
        return this.activeFilter === "all" || product.categoryName === this.activeFilter;
    }

    private matchesAvailability(product: Product): boolean {
        if (this.activeAvailability === "all") {
            return true;
        }

        return product.inStock === (this.activeAvailability === "true");
    }

    private matchesSearchQuery(product: Product): boolean {
        const normalizedQuery = this.searchQuery.trim().toLowerCase();

        if (!normalizedQuery) {
            return true;
        }

        return (
            product.name.toLowerCase().includes(normalizedQuery) ||
            product.description.toLowerCase().includes(normalizedQuery) ||
            product.categoryName.toLowerCase().includes(normalizedQuery) ||
            product.country.toLowerCase().includes(normalizedQuery)
        );
    }

    private sortVisibleProducts(products: Product[]): Product[] {
        const nextProducts = [...products];

        switch (this.activeSort) {
            case "price-asc":
                nextProducts.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                nextProducts.sort((a, b) => b.price - a.price);
                break;
            case "name":
                nextProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "rating":
                nextProducts.sort((a, b) => b.rating - a.rating);
                break;
        }

        return nextProducts;
    }

    private getVisibleProducts(): Product[] {
        const filteredProducts = this.state.products.filter(product =>
            this.matchesActiveFilter(product) &&
            this.matchesAvailability(product) &&
            this.matchesSearchQuery(product)
        );

        return this.sortVisibleProducts(filteredProducts);
    }

    private refreshCatalog(): void {
        this.updateCatalog(this.getVisibleProducts());
    }

    private scrollToCatalog(): void {
        const catalog = this.element.querySelector("#catalog");
        if (catalog instanceof HTMLElement) {
            catalog.scrollIntoView({ behavior: "smooth", block: "start" });
        }
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
            <div class="footer-grid footer-3col">

                <!-- Бренд -->
                <div class="footer-brand">
                    <a href="/" class="logo">
                        <i class="fas fa-wine-bottle"></i>
                        <span>Wine & Spirits</span>
                    </a>
                    <p>Премиальный алкоголь для ценителей. Лучшие напитки со всего мира.</p>
                </div>

                <!-- О компании -->
                <div class="footer-links">
                    <h4>О компании</h4>
                    <ul>
                        <li><span>Работаем с 2015 года</span></li>
                        <li><span>Сертифицированные поставщики</span></li>
                        <li><span>Контроль качества продукции</span></li>
                    </ul>
                </div>

                <!-- Контакты -->
                <div class="footer-links">
                    <h4>Контакты</h4>
                    <ul>
                        <li><a href="tel:+3754499999999">+375 (44) 999‑99‑99</a></li>
                        <li><a href="mailto:info@beer6769.com">info@beer6769.com</a></li>
                        <li><span>г. Минск, ул. Колесникова, 3</span></li>
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
        const basket = this.element.querySelector("#cartBtn");
        const profile = this.element.querySelector(".profile-btn");
        const login = this.element.querySelector(".login-btn");
        const register = this.element.querySelector(".register-btn");
        const goProfile = this.element.querySelector("#goProfile");
        const goCheckout = this.element.querySelector("#goCheckout");

        login?.addEventListener("click", () => {
            router.navigate("/login");
        });

        register?.addEventListener("click", () => {
            router.navigate("/register");
        });
        basket?.addEventListener("click", () => {
            router.navigate("/checkout");
        });
        profile?.addEventListener("click", () => {
            if (!this.state.isLoggedIn) {
                router.navigate("/login");
            }
        });
        goProfile?.addEventListener("click", (event) => {
            event.preventDefault();
            router.navigate("/profile");
        });
        goCheckout?.addEventListener("click", (event) => {
            event.preventDefault();
            router.navigate("/checkout");
        });

    }

    private attachSearchEvents() {
        const toggle = this.element.querySelector("#searchToggle");
        const close = this.element.querySelector("#closeSearch");
        const overlay = this.element.querySelector("#searchOverlay");
        const input = this.element.querySelector("#searchInput") as HTMLInputElement | null;

        toggle?.addEventListener("click", () => {
            const isOpen = overlay?.classList.toggle("active");
            if (isOpen && input) {
                input.focus();
                this.scrollToCatalog();
            }
        });

        close?.addEventListener("click", () => {
            overlay?.classList.remove("active");
        });

        overlay?.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.classList.remove("active");
            }
        });
    }


    private attachProfileEvents() {
        const btn = this.element.querySelector("#profileBtn");
        const dropdown = this.element.querySelector("#profileDropdown");
        const logout = this.element.querySelector("#logoutBtn");

        btn?.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!this.state.isLoggedIn) return;
            dropdown?.classList.toggle("active");
        });

        logout?.addEventListener("click", async (event) => {
            event.preventDefault();

            try {
                await UserService.logout();
            } catch (error) {
                console.error("Logout failed", error);
            }

            this.setState({
                currentUser: null,
                isLoggedIn: false
            });

            router.navigate("/");
        });
    }

    private attachOutsideClickHandler(): void {
        if (this.isDocumentClickBound) return;

        document.addEventListener("click", this.handleDocumentClick);
        this.isDocumentClickBound = true;
    }

    private handleDocumentClick = (e: MouseEvent): void => {
        const dropdown = this.element.querySelector("#profileDropdown");
        const btn = this.element.querySelector("#profileBtn");

        if (!dropdown) return;

        if (!dropdown.contains(e.target as Node) && !btn?.contains(e.target as Node)) {
            dropdown.classList.remove("active");
        }
    }

    private attachFilters() {
        this.element.querySelectorAll("[data-filter]").forEach(btn => {
            btn.addEventListener("click", () => {
                this.element.querySelectorAll("[data-filter]").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                this.activeFilter = btn.getAttribute("data-filter") || "all";
                this.refreshCatalog();
            });
        });
    }

    private attachAvailabilitySelect(): void {
        const select = this.element.querySelector("#availabilitySelect") as HTMLSelectElement | null;
        if (!select) return;

        select.value = this.activeAvailability;
        select.addEventListener("change", () => {
            this.activeAvailability = select.value as ProductAvailability;
            this.refreshCatalog();
        });
    }

    private attachSort() {
        const select = this.element.querySelector("#sortSelect") as HTMLSelectElement | null;
        if (!select) return;

        select.value = this.activeSort;
        select.addEventListener("change", () => {
            this.activeSort = select.value as ProductSort;
            this.refreshCatalog();
        });
    }

    private attachSearchInput() {
        const input = this.element.querySelector("#searchInput") as HTMLInputElement | null;
        if (!input) return;

        input.value = this.searchQuery;
        input.addEventListener("input", () => {
            if (this.searchDebounceTimer) {
                clearTimeout(this.searchDebounceTimer);
            }

            this.searchDebounceTimer = setTimeout(() => {
                this.searchQuery = input.value;
                this.refreshCatalog();
                if (this.searchQuery.trim()) {
                    this.scrollToCatalog();
                }
            }, 180);
        });
    }


private attachAddToCartHandlers() {
    const grid = this.element.querySelector(".products-grid");
    if (!(grid instanceof HTMLElement)) return;
    if (grid.dataset.cartHandlersBound === "true") return;

    grid.dataset.cartHandlersBound = "true";
    grid.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const button = target.closest(".add-to-cart-btn");
        if (!button) return;

        void this.handleAddToCart(button);
    });
}

private async handleAddToCart(btn: Element): Promise<void> {
            const id = Number(btn.getAttribute("data-id"));
            const product = this.state.products.find(p => p.id === id);

            if (!product) return;
            if (!product.inStock) {
                alert("Товар временно отсутствует");
                return;
            }

            if (!this.state.currentUser) {
                router.navigate("/register");
                return;
            }

            await this.addToCart(product);
}


private async addToCart(product: Product): Promise<void> {
    const currentUser = this.state.currentUser;
    if (!currentUser) {
        return;
    }

    const existing = currentUser.cart.find((item: CartItem) => item.id === product.id);
    const cart = existing
        ? currentUser.cart.map((item: CartItem) =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        )
        : [
            ...currentUser.cart,
            {
                id: product.id,
                name: product.name,
                image: product.image,
                categoryName: product.categoryName,
                price: product.price,
                quantity: 1
            }
        ];

    try {
        await UserService.update(currentUser.id, { cart });
        const nextUser = new User({
            ...currentUser,
            cart
        });

        this.setState({
            currentUser: nextUser,
            isLoggedIn: true
        });
        this.updateCartBadge();
    } catch (error) {
        console.error("Failed to update cart", error);
        alert("Не удалось обновить корзину");
    }
}
private updateCartBadge() {
    const badge = this.element.querySelector(".cart-badge");
    if (!badge) return;

    const count = this.getCartCount();

    badge.textContent = count.toString();
}

private getCartCount(): number {
    return (this.state.currentUser?.cart ?? []).reduce((sum, item) => sum + item.quantity, 0);
}
}
