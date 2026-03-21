import { UserService } from "../api/user";
import { Component } from "../utils/Component/Component";
import { bindAuthPageNavigation, buildAuthPageStyles, renderAuthPage } from "../utils/helper/auth-page";
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
        return buildAuthPageStyles({
            decorImage: "https://images.unsplash.com/photo-1506377295352-e3154d4f6089?q=80&w=800",
            containerMaxWidth: "1000px",
            formSectionPadding: "80px 60px",
            formLayoutCss: `
            display: flex;
            flex-direction: column;
            gap: 25px;
            `,
            extraCss: `
        #goRegister.auth-footer-action:hover {
            text-decoration: underline;
        }
            `
        });
    }

    render(): string {
        return renderAuthPage({
            title: "Вход",
            subtitle: "Введите имя, email, логин или телефон и пароль.",
            decorText: "Исключительная коллекция премиальных напитков для истинных ценителей.",
            formId: "loginForm",
            formContent: `
                        <div class="input-group">
                            <label for="identifier">Имя / Email / Логин / Телефон</label>
                            <input id="identifier" name="identifier" type="text" placeholder="ivan, ivan@mail.com, +375..." required>
                        </div>
                        <div class="input-group">
                            <label for="password">Пароль</label>
                            <input id="password" name="password" type="password" placeholder="••••••••" required>
                        </div>
                        ${this.state.error ? `<div class="auth-error">${this.state.error}</div>` : ""}
                        <button type="submit" class="submit-btn ui-btn ui-btn--accent ui-btn--full" ${this.state.isSubmitting ? "disabled" : ""}>
                            ${this.state.isSubmitting ? "Входим..." : "Войти в личный кабинет"}
                        </button>
            `,
            footerPrompt: "Нет аккаунта?",
            footerActionId: "goRegister",
            footerActionText: "Зарегистрироваться"
        });
    }

    protected addMove(): void {
        const form = this.element.querySelector("#loginForm");
        bindAuthPageNavigation(this.element, "#goRegister", "/register");

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
        const identifier = String(formData.get("identifier") ?? "").trim();
        const password = String(formData.get("password") ?? "").trim();

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
