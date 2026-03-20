import { UserService } from "../api/user";
import { Component } from "../utils/Component";
import { router } from "../utils/router/router-instance";

interface AuthState {
    isSubmitting: boolean;
    error: string;
}

export class AuthComponent extends Component<AuthState> {
    constructor() {
        super("div", { isSubmitting: false, error: "" }, "auth-page-wrapper");
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
            max-width: 1000px;
            background: #ffffff;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
            position: relative;
        }

        .auth-decor {
            flex: 1;
            background: linear-gradient(rgba(45, 0, 5, 0.85), rgba(10, 10, 10, 0.95)),
                        url('https://images.unsplash.com/photo-1506377295352-e3154d4f6089?q=80&w=800') center/cover;
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
            cursor: pointer;
            user-select: none;
        }

        .auth-decor .logo-big i {
            color: #e0c3fc;
        }

        .auth-decor p {
            font-size: 1.1rem;
            line-height: 1.6;
            opacity: 0.8;
            max-width: 320px;
        }

        .auth-form-section {
            flex: 1.2;
            padding: 80px 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .auth-header {
            margin-bottom: 40px;
        }

        .auth-header h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2.8rem;
            color: #1a1a1a;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .auth-header p {
            color: #666666;
            font-size: 1rem;
        }

        .auth-form {
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .input-group label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: #333333;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .auth-form input {
            width: 100%;
            padding: 16px 20px;
            background: #f4f4f4;
            border: 1px solid #e0e0e0;
            border-radius: 15px;
            color: #1a1a1a;
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .auth-form input:focus {
            outline: none;
            border-color: #2d0005;
            background: #ffffff;
            box-shadow: 0 0 0 4px rgba(45, 0, 5, 0.1);
        }

        .submit-btn {
            background: #1a1a1a;
            color: #ffffff;
            padding: 18px;
            border: none;
            border-radius: 15px;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 15px;
            letter-spacing: 0.5px;
        }

        .submit-btn:hover {
            background: #2d0005;
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(45, 0, 5, 0.3);
        }

        .submit-btn:disabled {
            opacity: 0.7;
            cursor: wait;
            transform: none;
            box-shadow: none;
        }

        .auth-error {
            margin-top: -8px;
            color: #a52a2a;
            font-size: 0.95rem;
        }

        .auth-footer {
            margin-top: 35px;
            text-align: center;
            color: #666666;
            font-size: 1rem;
        }

        #goRegister {
            color: #2d0005;
            text-decoration: none;
            font-weight: 700;
            cursor: pointer;
            transition: color 0.3s ease;
            margin-left: 5px;
        }

        #goRegister:hover {
            color: #a52a2a;
            text-decoration: underline;
        }

        @media (max-width: 768px) {
            .auth-container {
                flex-direction: column;
                border-radius: 20px;
            }
            .auth-decor {
                padding: 40px;
                order: 2;
            }
            .auth-decor .logo-big {
                font-size: 2rem;
            }
            .auth-form-section {
                padding: 50px 30px;
                order: 1;
            }
            .auth-header h2 {
                font-size: 2.2rem;
            }
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
                    <p>Исключительная коллекция премиальных напитков для истинных ценителей.</p>
                </div>

                <div class="auth-form-section">
                    <div class="auth-header">
                        <h2>Вход</h2>
                        <p>Введите имя, email, логин или телефон и пароль.</p>
                    </div>

                    <form id="loginForm" class="auth-form">
                        <div class="input-group">
                            <label for="identifier">Имя / Email / Логин / Телефон</label>
                            <input id="identifier" type="text" placeholder="ivan, ivan@mail.com, +375..." required>
                        </div>
                        <div class="input-group">
                            <label for="password">Пароль</label>
                            <input id="password" type="password" placeholder="••••••••" required>
                        </div>
                        ${this.state.error ? `<div class="auth-error">${this.state.error}</div>` : ""}
                        <button type="submit" class="submit-btn" ${this.state.isSubmitting ? "disabled" : ""}>
                            ${this.state.isSubmitting ? "Входим..." : "Войти в личный кабинет"}
                        </button>
                    </form>

                    <div class="auth-footer">
                        Нет аккаунта? <span id="goRegister">Зарегистрироваться</span>
                    </div>
                </div>
            </div>
        `;
    }

    protected addMove(): void {
        const form = this.element.querySelector("#loginForm");
        const logo = this.element.querySelector(".logo-big");
        const goRegister = this.element.querySelector("#goRegister");

        logo?.addEventListener("click", () => {
            router.navigate("/");
        });

        goRegister?.addEventListener("click", () => {
            router.navigate("/register");
        });

        if (form instanceof HTMLFormElement) {
            form.addEventListener("submit", (event) => {
                void this.handleSubmit(event);
            });
        }
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        const form = event.currentTarget;
        if (!(form instanceof HTMLFormElement) || this.state.isSubmitting) {
            return;
        }

        const identifier = (this.element.querySelector("#identifier") as HTMLInputElement | null)?.value.trim() ?? "";
        const password = (this.element.querySelector("#password") as HTMLInputElement | null)?.value.trim() ?? "";

        if (!identifier || !password) {
            this.setState({ error: "Заполните логин и пароль" });
            return;
        }

        this.setState({ isSubmitting: true, error: "" });

        try {
            await UserService.login({ identifier, password });
            router.navigate("/");
        } catch (error) {
            this.setState({
                isSubmitting: false,
                error: error instanceof Error ? error.message : "Ошибка входа"
            });
            return;
        }

        this.setState({ isSubmitting: false, error: "" });
    }
}
