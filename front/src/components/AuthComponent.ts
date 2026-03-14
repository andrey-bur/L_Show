import { Component } from "../utils/Component";
import { AuthService } from "../utils/AuthService";

export class AuthComponent extends Component<{}> {
    constructor() {
        super("div", {}, "auth-page");
    }

    render(): string {
        return `
            <div class="auth-wrapper">
                <h2>Вход</h2>

                <form id="loginForm">
                    <input id="email" placeholder="Email" required>
                    <input id="password" type="password" placeholder="Пароль" required>
                    <button type="submit">Войти</button>
                </form>

                <p>Нет аккаунта? <span id="goRegister">Регистрация</span></p>
            </div>
        `;
    }

    afterRender() {
        const form = this.element.querySelector("#loginForm") as HTMLFormElement;
        const goRegister = this.element.querySelector("#goRegister");

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = (this.element.querySelector("#email") as HTMLInputElement).value;
            const password = (this.element.querySelector("#password") as HTMLInputElement).value;

            AuthService.login(email, password);

            window.dispatchEvent(new CustomEvent("authChange", {
                detail: { isLoggedIn: true, userEmail: email }
            }));

            window.location.href = "/";
        });

        goRegister?.addEventListener("click", () => {
            window.location.href = "/register";
        });
    }
}
