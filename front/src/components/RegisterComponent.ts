import { Component } from "../utils/Component";
import { router } from "../utils/router/router-instance";

export class RegisterComponent extends Component<{}> {
    constructor() {
        super("div", {}, "auth-page-wrapper");
        this.applyStyles("auth-styles", this.buildStyles());
    }

    private buildStyles(): string {
        return `
        .auth-page-wrapper {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%);
            padding: 40px 20px;
            font-family: 'Inter', sans-serif;
        }

        .auth-container {
            display: flex;
            width: 100%;
            max-width: 1100px; /* Немного шире для длинной формы */
            background: #ffffff;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
        }

        .auth-decor {
            flex: 1;
            background: linear-gradient(rgba(45, 0, 5, 0.85), rgba(10, 10, 10, 0.95)),
                        url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80') center/cover;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 60px;
            color: #ffffff;
            text-align: center;
        }

        .auth-decor .logo-big {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .auth-form-section {
            flex: 1.2;
            padding: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .auth-header h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2.8rem;
            color: #1a1a1a;
            margin-bottom: 8px;
        }

        .auth-form {
            display: grid;
            grid-template-columns: 1fr 1fr; /* Поля в две колонки */
            gap: 20px;
        }

        .input-group {
            display: flex;
            flex-direction: column;
        }

        .input-group.full-width {
            grid-column: span 2;
        }

        .input-group label {
            font-size: 0.8rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 6px;
            text-transform: uppercase;
        }

        .auth-form input {
            padding: 14px 18px;
            background: #f4f4f4;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        .auth-form input:focus {
            outline: none;
            border-color: #2d0005;
            background: #fff;
            box-shadow: 0 0 0 4px rgba(45, 0, 5, 0.1);
        }

        .submit-btn {
            grid-column: span 2;
            background: #1a1a1a;
            color: #fff;
            padding: 16px;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        .submit-btn:hover {
            background: #2d0005;
            transform: translateY(-2px);
        }

        .auth-footer {
            margin-top: 30px;
            text-align: center;
            grid-column: span 2; 
            color: #666;
            font-size: 0.95rem;
            font-family: 'Inter', sans-serif;
        }

        #goLogin {
            color: #2d0005;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            margin-left: 5px;
            display: inline-block;
            position: relative;
            transition: color 0.3s ease;
        }

        #goLogin:hover {
            color: #a52a2a; 
        }

        #goLogin::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #a52a2a;
            transition: width 0.3s ease;
        }

        #goLogin:hover::after {
            width: 100%; 
        }
            .auth-decor .logo-big {
                cursor: pointer; 
                user-select: none;
            }
        `;
    }

    render(): string {
        return `
            <div class="auth-container">
                <div class="auth-decor">
                    <div class="logo-big">
                        <i class="fas fa-wine-bottle"></i>
                        <span>Wine & Spirits</span>
                    </div>
                    <p>Станьте частью нашего закрытого клуба ценителей благородных напитков.</p>
                </div>

                <div class="auth-form-section">
                    <div class="auth-header">
                        <h2>Регистрация</h2>
                        <p style="color: #666; margin-bottom: 30px;">Создайте аккаунт для доступа к коллекции</p>
                    </div>

                    <form id="registerForm" class="auth-form">
                        <div class="input-group">
                            <label for="reg-name">Ваше имя</label>
                            <input id="reg-name" type="text" placeholder="Иван Петров" required>
                        </div>
                        <div class="input-group">
                            <label for="reg-phone">Телефон</label>
                            <input id="reg-phone" type="tel" placeholder="+7 (999) 000-00-00" required>
                        </div>
                        <div class="input-group full-width">
                            <label for="reg-email">Электронная почта</label>
                            <input id="reg-email" type="email" placeholder="mail@example.com" required>
                        </div>
                        <div class="input-group full-width">
                            <label for="reg-password">Придумайте пароль</label>
                            <input id="reg-password" type="password" placeholder="••••••••" required>
                        </div>
                        
                        <button type="submit" class="submit-btn">Создать профиль</button>
                    </form>

                    <div class="auth-footer">
                        Уже есть аккаунт? <span id="goLogin">Войти в систему</span>
                    </div>
                </div>
            </div>
        `;
    }
    protected addMove(): void {
        this.afterRender();
    }

    afterRender() {
        const form = this.element.querySelector("#registerForm") as HTMLFormElement;
        const logo = this.element.querySelector(".logo-big");
        const goLogin = this.element.querySelector("#goLogin");

        logo?.addEventListener("click", () => {
            router.navigate("/");
        });

        form?.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = (this.element.querySelector("#reg-name") as HTMLInputElement).value;
            const phone = (this.element.querySelector("#reg-phone") as HTMLInputElement).value;
            const email = (this.element.querySelector("#reg-email") as HTMLInputElement).value;
            const password = (this.element.querySelector("#reg-password") as HTMLInputElement).value;

            console.log("Данные регистрации:", { name, phone, email, password });

            router.navigate("/login"); 
        });

        goLogin?.addEventListener("click", () => {
            router.navigate("/login");
        });
    }
}