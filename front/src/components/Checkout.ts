import { hasAuthHint, UserService } from "../api/user";
import { CartItem, Delivery, User } from "../interface/User";
import { Component } from "../utils/Component";
import { router } from "../utils/router/router-instance";

interface CheckoutState {
    items: CartItem[];
    user: User | null;
    isLoading: boolean;
}

export class Checkout extends Component<CheckoutState> {
    constructor() {
        super("div", {
            items: [],
            user: null,
            isLoading: true
        }, "checkout-wrapper");

        this.applyStyles("checkout-styles", this.buildStyles());
        void this.loadCheckout();
    }

    private async loadCheckout(): Promise<void> {
        if (!hasAuthHint()) {
            router.navigate("/login");
            return;
        }

        try {
            const user = await UserService.getCurrent();

            if (!user) {
                router.navigate("/login");
                return;
            }

            this.setState({
                user,
                items: user.cart,
                isLoading: false
            });
        } catch (error) {
            console.error("Failed to load checkout", error);
            router.navigate("/login");
        }
    }

    render(): string {
        if (this.state.isLoading) {
            return `
            <main class="checkout">
                <div class="container">
                    <div class="checkout-items">
                        <h2 class="section-title">Загрузка корзины...</h2>
                    </div>
                </div>
            </main>
            `;
        }

        const user = this.state.user;
        if (!user) {
            return "";
        }

        return `
        <main class="checkout">
            <div class="container checkout-grid">
                <section class="checkout-top">
                    <button class="back-btn" id="goBackToShop" type="button">
                        <i class="fas fa-arrow-left"></i> Вернуться в магазин
                    </button>
                </section>

                <section class="checkout-items">
                    <h2 class="section-title">Активная корзина</h2>
                    <div class="items-list">
                        ${this.renderItems()}
                    </div>
                </section>

                <aside class="checkout-sidebar">
                    <div class="account-box">
                        <h3 class="sidebar-title">Аккаунт</h3>

                        <div class="account-row">
                            <span>Имя</span>
                            <strong>${user.name}</strong>
                        </div>
                        <div class="account-row">
                            <span>Email</span>
                            <strong>${user.email}</strong>
                        </div>
                        <div class="account-row">
                            <span>Телефон</span>
                            <strong>${user.phone}</strong>
                        </div>
                        <div class="account-row">
                            <span>Логин</span>
                            <strong>${user.login}</strong>
                        </div>
                    </div>

                    <div class="delivery-box">
                        <h3 class="sidebar-title">Оформление доставки</h3>
                        ${this.renderDeliveryForm(user)}
                    </div>

                    <div class="delivery-box">
                        <h3 class="sidebar-title">Активные доставки</h3>
                        ${this.renderDeliveries()}
                    </div>

                    <div class="total-box">
                        <div class="total-row">
                            <span>Итого</span>
                            <strong>${this.calculateTotal().toLocaleString()} ₽</strong>
                        </div>
                    </div>
                </aside>

            </div>
        </main>
        `;
    }

    private renderItems(): string {
        if (this.state.items.length === 0) {
            return `<div class="empty-state">Корзина пуста. Вернитесь в каталог и добавьте напитки.</div>`;
        }

        return this.state.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <div>
                        <div class="item-title" data-title="basket">${item.name}</div>
                        <div class="item-meta">${item.categoryName}</div>
                        <div class="item-price" data-price="basket">${item.price.toLocaleString()} ₽</div>
                    </div>

                    <div class="qty-controls">
                        <button class="qty-btn" data-id="${item.id}" data-action="minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
                    </div>

                    <div class="remove-btn" data-id="${item.id}">Удалить</div>
                </div>
            </div>
        `).join("");
    }

    private renderDeliveryForm(user: User): string {
        return `
            <form id="deliveryForm" data-delivery>
                <div class="form-group">
                    <label for="deliveryAddress">Адрес доставки</label>
                    <input id="deliveryAddress" name="address" type="text" value="Минск, ул. Колесникова, 3" required data-delivery-address>
                </div>
                <div class="form-group">
                    <label for="deliveryPhone">Телефон</label>
                    <input id="deliveryPhone" name="phone" type="tel" value="${user.phone}" required data-delivery-phone>
                </div>
                <div class="form-group">
                    <label for="deliveryEmail">Email</label>
                    <input id="deliveryEmail" name="email" type="email" value="${user.email}" required data-delivery-email>
                </div>
                <div class="form-group">
                    <label for="deliveryPayment">Оплата</label>
                    <select id="deliveryPayment" name="paymentMethod" required data-delivery-payment>
                        <option value="card">Картой онлайн</option>
                        <option value="cash">Наличными курьеру</option>
                    </select>
                </div>
                <button class="checkout-submit" id="checkoutSubmit" type="submit" ${this.state.items.length === 0 ? "disabled" : ""}>
                    Подтвердить заказ
                </button>
            </form>
        `;
    }

    private renderDeliveries(): string {
        const deliveries = this.state.user?.deliveries ?? [];

        if (deliveries.length === 0) {
            return `<div class="empty-deliveries">Активных доставок пока нет.</div>`;
        }

        return deliveries.map(delivery => `
            <div class="delivery-item">
                <div class="delivery-head">
                    <strong>#${delivery.id}</strong>
                    <span>${delivery.status}</span>
                </div>
                <div class="delivery-meta">${delivery.address}</div>
                <div class="delivery-meta">${new Date(delivery.createdAt).toLocaleString()}</div>
                <div class="delivery-meta">${delivery.itemsCount} шт. • ${delivery.total.toLocaleString()} ₽</div>
            </div>
        `).join("");
    }

    private calculateTotal(): number {
        return this.state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    protected addMove(): void {
        this.attachQtyHandlers();
        this.attachRemoveHandlers();
        this.element.querySelector("#goBackToShop")?.addEventListener("click", () => {
            router.navigate("/#catalog");
        });

        const form = this.element.querySelector("#deliveryForm");
        if (form instanceof HTMLFormElement) {
            form.addEventListener("submit", (event) => {
                void this.handleDeliverySubmit(event);
            });
        }
    }

    private attachQtyHandlers(): void {
        const buttons = this.element.querySelectorAll(".qty-btn");

        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                void this.updateQuantity(btn);
            });
        });
    }

    private async updateQuantity(btn: Element): Promise<void> {
        const id = Number(btn.getAttribute("data-id"));
        const action = btn.getAttribute("data-action");

        const items = [...this.state.items];
        const item = items.find(currentItem => currentItem.id === id);
        if (!item || !this.state.user) {
            return;
        }

        if (action === "plus") item.quantity++;
        if (action === "minus" && item.quantity > 1) item.quantity--;

        await this.persistUser({
            cart: items
        });
    }

    private attachRemoveHandlers(): void {
        const buttons = this.element.querySelectorAll(".remove-btn");

        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                void this.removeItem(btn);
            });
        });
    }

    private async removeItem(btn: Element): Promise<void> {
        if (!this.state.user) {
            return;
        }

        const id = Number(btn.getAttribute("data-id"));
        const items = this.state.items.filter(item => item.id !== id);

        await this.persistUser({
            cart: items
        });
    }

    private async handleDeliverySubmit(event: Event): Promise<void> {
        event.preventDefault();

        const form = event.currentTarget;
        if (!(form instanceof HTMLFormElement)) {
            return;
        }

        const formData = new FormData(form);
        const address = String(formData.get("address") ?? "").trim();
        const phone = String(formData.get("phone") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const paymentMethod = String(formData.get("paymentMethod") ?? "").trim();

        if (!address || !phone || !email || !paymentMethod) {
            alert("Заполните все поля доставки");
            return;
        }

        await this.completeCheckout({
            address,
            phone,
            email,
            paymentMethod
        });
    }

    private async completeCheckout(details: {
        address: string;
        phone: string;
        email: string;
        paymentMethod: string;
    }): Promise<void> {
        const user = this.state.user;
        if (!user || this.state.items.length === 0) {
            return;
        }

        const newDelivery: Delivery = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            status: "Оформлен",
            address: details.address,
            phone: details.phone,
            email: details.email,
            paymentMethod: details.paymentMethod,
            itemsCount: this.state.items.reduce((sum, item) => sum + item.quantity, 0),
            total: this.calculateTotal()
        };

        await this.persistUser({
            cart: [],
            deliveries: [newDelivery, ...user.deliveries]
        });

        alert("Доставка успешно оформлена, корзина очищена.");
    }

    private async persistUser(data: Partial<User>): Promise<void> {
        const user = this.state.user;
        if (!user) {
            return;
        }

        try {
            await UserService.update(user.id, data);

            const nextUser = new User({
                ...user,
                ...data
            });

            this.setState({
                user: nextUser,
                items: nextUser.cart
            });
        } catch (error) {
            console.error("Failed to update checkout state", error);
            alert("Не удалось сохранить изменения");
        }
    }

    private buildStyles(): string {
        return `/* ===================== ОСНОВА ===================== */

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

body {
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: "Inter", sans-serif;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}

.checkout {
    padding: 120px 0;
}

.checkout-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 60px;
}

.checkout-top {
    grid-column: 1 / -1;
}

.back-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg-card);
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
}

.back-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
}

.checkout-items {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px;
    box-shadow: var(--shadow);
}

.section-title,
.sidebar-title {
    font-family: "Playfair Display", serif;
    font-size: 2rem;
    margin-bottom: 25px;
}

.items-list {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.cart-item {
    display: flex;
    gap: 20px;
    padding: 22px;
    background: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 18px;
    transition: var(--transition);
}

.cart-item:hover {
    border-color: var(--accent);
    background: rgba(255, 107, 53, 0.05);
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(255, 107, 53, 0.25);
}

.cart-item img {
    width: 120px;
    height: 160px;
    object-fit: cover;
    border-radius: 12px;
}

.item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.item-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 6px;
}

.item-meta,
.delivery-meta,
.empty-deliveries,
.empty-state {
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.item-price {
    color: var(--accent);
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 15px;
}

.qty-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.qty-btn {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
}

.qty-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    transform: translateY(-2px);
}

.remove-btn {
    margin-top: 12px;
    color: var(--text-muted);
    font-size: 0.85rem;
    cursor: pointer;
}

.remove-btn:hover {
    color: var(--accent);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
}

.form-group label {
    color: var(--text-secondary);
    font-size: 0.85rem;
}

.form-group input,
.form-group select {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--bg-hover);
    color: var(--text-primary);
}

.checkout-sidebar {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.account-box,
.delivery-box,
.total-box {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    box-shadow: var(--shadow);
}

.account-row,
.total-row,
.delivery-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
}

.account-row {
    margin-bottom: 16px;
}

.account-row span {
    color: var(--text-secondary);
}

.delivery-item {
    border-top: 1px solid var(--border);
    padding-top: 14px;
    margin-top: 14px;
}

.delivery-item:first-of-type {
    border-top: none;
    padding-top: 0;
    margin-top: 0;
}

.delivery-head span {
    color: var(--accent);
}

.total-row {
    font-size: 1.1rem;
    margin-bottom: 20px;
}

.checkout-submit {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 14px;
    background: var(--gradient);
    color: #fff;
    font-weight: 700;
    cursor: pointer;
}

.checkout-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 992px) {
    .checkout-grid {
        grid-template-columns: 1fr;
    }
}
`;
    }
}
