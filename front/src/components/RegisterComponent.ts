import { UserService } from "../api/user";
import { Component } from "../utils/Component/Component";
import { bindAuthPageNavigation, buildAuthPageStyles, renderAuthPage } from "../utils/helper/auth-page";
import { router } from "../utils/router/router-instance";

interface RegisterState {
    isSubmitting: boolean;
    error: string;
}

export class RegisterComponent extends Component<RegisterState> {
    constructor() {
        super("div", { isSubmitting: false, error: "" }, "auth-page-wrapper");
        this.applyStyles("auth-styles", this.buildStyles());
    }

    private buildStyles(): string {
        return buildAuthPageStyles({
            decorImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
            containerMaxWidth: "1100px",
            formSectionPadding: "60px",
            formLayoutCss: `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            `,
            extraCss: `
        .input-group.full-width {
            grid-column: span 2;
        }

        .submit-btn {
            grid-column: span 2;
            padding: 16px;
            border-radius: 12px;
            font-size: 1rem;
            margin-top: 10px;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
        }

        .auth-error {
            grid-column: span 2;
            margin-top: 0;
        }

        .auth-footer {
            margin-top: 30px;
            font-size: 0.95rem;
        }

        #goLogin.auth-footer-action {
            display: inline-block;
            position: relative;
        }

        #goLogin.auth-footer-action::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #a52a2a;
            transition: width 0.3s ease;
        }

        #goLogin.auth-footer-action:hover::after {
            width: 100%;
        }

        @media (max-width: 768px) {
            .auth-form {
                grid-template-columns: 1fr;
            }

            .input-group.full-width,
            .submit-btn,
            .auth-error {
                grid-column: span 1;
            }
        }
            `
        });
    }

    render(): string {
        return renderAuthPage({
            title: "Регистрация",
            subtitle: "Создайте аккаунт и получите активную корзину и доставки в профиле.",
            decorText: "Станьте частью нашего закрытого клуба ценителей благородных напитков.",
            formId: "registerForm",
            formContent: `
                        <div class="input-group">
                            <label for="reg-name">Ваше имя</label>
                            <input id="reg-name" name="name" type="text" placeholder="Иван Петров" required>
                        </div>
                        <div class="input-group">
                            <label for="reg-login">Логин</label>
                            <input id="reg-login" name="login" type="text" placeholder="ivan_petrov" required>
                        </div>
                        <div class="input-group">
                            <label for="reg-phone">Телефон</label>
                            <input id="reg-phone" name="phone" type="tel" placeholder="+375 (29) 000-00-00" required>
                        </div>
                        <div class="input-group">
                            <label for="reg-email">Электронная почта</label>
                            <input id="reg-email" name="email" type="email" placeholder="mail@example.com" required>
                        </div>
                        <div class="input-group full-width">
                            <label for="reg-password">Придумайте пароль</label>
                            <input id="reg-password" name="password" type="password" placeholder="••••••••" minlength="4" required>
                        </div>
                        ${this.state.error ? `<div class="auth-error">${this.state.error}</div>` : ""}
                        <button type="submit" class="submit-btn" ${this.state.isSubmitting ? "disabled" : ""}>
                            ${this.state.isSubmitting ? "Создаём..." : "Создать профиль"}
                        </button>
            `,
            footerPrompt: "Уже есть аккаунт?",
            footerActionId: "goLogin",
            footerActionText: "Войти в систему"
        });
    }

    protected addMove(): void {
        const form = this.element.querySelector("#registerForm");
        bindAuthPageNavigation(this.element, "#goLogin", "/login");

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

        const formData = new FormData(form);
        const name = String(formData.get("name") ?? "").trim();
        const login = String(formData.get("login") ?? "").trim();
        const phone = String(formData.get("phone") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "").trim();

        if (!name || !login || !phone || !email || !password) {
            this.setState({ error: "Заполните все поля" });
            return;
        }

        this.setState({ isSubmitting: true, error: "" });

        try {
            await UserService.register({
                name,
                login,
                phone,
                email,
                password
            });
            router.navigate("/");
        } catch (error) {
            this.setState({
                isSubmitting: false,
                error: error instanceof Error ? error.message : "Ошибка регистрации"
            });
            return;
        }

        this.setState({ isSubmitting: false, error: "" });
    }
}
