import { Component } from "../utils/Component";
import { AuthService } from "../utils/AuthService";

export class RegisterComponent extends Component<{}> {
    constructor() {
        super("div", {}, "register-page");
    }

    render(): string {
        return `
            <div class="auth-wrapper">
                <h2>Регистрация</h2>

                <form id="registerForm">
                    <input id="email" placeholder="Email" required>
                    <input id="password" type="password" placeholder="Пароль" required>
                    <button type="submit">Создать аккаунт</button>
                </form>

                <p>Уже есть аккаунт? <span id="goLogin">Войти</span></p>
            </div>
        `;
    }

    afterRender() {
        const form = this.element.querySelector("#registerForm") as HTMLFormElement;
        const goLogin = this.element.querySelector("#goLogin");

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = (this.element.querySelector("#email") as HTMLInputElement).value;
            const password = (this.element.querySelector("#password") as HTMLInputElement).value;

            AuthService.register(email, password);

            window.location.href = "/auth";
        });

        goLogin?.addEventListener("click", () => {
            window.location.href = "/auth";
        });
    }
}
