import { UserService } from "../api/user";
import { User } from "../interface/User";
import { Component } from "../utils/Component";
import { router } from "../utils/router/router-instance";

interface ProfileState {
    user: User | null;
    isLoading: boolean;
    isModalOpen: boolean;
    isPasswordFieldsOpen: boolean;
    isSaving: boolean;
}

const EMPTY_USER = new User({
    id: 0,
    name: "",
    email: "",
    login: "",
    phone: "",
    password: "",
    cart: [],
    deliveries: []
});

export class Profile extends Component<ProfileState> {
    constructor() {
        super(
            "main",
            {
                user: null,
                isLoading: true,
                isModalOpen: false,
                isPasswordFieldsOpen: false,
                isSaving: false
            },
            "profile-main"
        );

        this.applyStyles("profile-styles", this.buildStyles());
        void this.init();
    }

    private async init(): Promise<void> {
        try {
            const user = await UserService.getCurrent();

            if (!user) {
                router.navigate("/login");
                return;
            }

            this.setState({
                user,
                isLoading: false
            });
        } catch (error) {
            console.error("Failed to load profile", error);
            router.navigate("/login");
        }
    }

    private buildStyles(): string {
        return `
            .profile-main { padding: 80px 0; background: var(--bg-primary); min-height: 100vh; }
            .profile-main .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
            .back-btn { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 40px; padding: 14px 22px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; color: var(--text-primary); font-weight: 500; transition: 0.3s; cursor: pointer; }
            .back-btn:hover { background: var(--accent); color: white; }
            .profile-layout { display: grid; grid-template-columns: 350px 1fr; gap: 40px; }
            .profile-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 40px; text-align: center; }
            .profile-avatar { width: 120px; height: 120px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; font-size: 42px; color: white; margin: 0 auto 20px; }
            .profile-card h2, .profile-info-block h2 { margin-top: 0; color: var(--text-primary); }
            .profile-card p, .info-item p, .loading-text { color: var(--text-primary); }
            .edit-btn { margin-top: 20px; padding: 16px 28px; font-size: 16px; background: var(--gradient); border: none; border-radius: 12px; color: white; cursor: pointer; }
            .edit-btn:disabled, .save-btn:disabled { opacity: 0.7; cursor: wait; }
            .profile-info-block { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 40px; }
            .info-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 25px; }
            .info-item { background: var(--bg-hover); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
            .info-item span { display: block; font-size: 14px; color: var(--text-secondary); }
            .info-item p { font-size: 18px; margin: 6px 0 0; word-break: break-word; }
            .loading-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 40px; text-align: center; }
            .modal { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 2000; }
            .modal.show { opacity: 1; pointer-events: auto; }
            .modal-content { background: var(--bg-card); padding: 25px; border-radius: 18px; width: 100%; max-width: 420px; max-height: 85vh; overflow-y: auto; border: 1px solid var(--border); }
            .modal-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
            .modal-header h3 { margin: 0; color: var(--text-primary); }
            .close-btn { border: none; background: transparent; color: var(--text-primary); cursor: pointer; font-size: 18px; }
            .form-group { display: flex; flex-direction: column; margin-bottom: 12px; text-align: left; }
            .form-group label { color: var(--text-primary); font-size: 13px; margin-bottom: 4px; }
            .form-group input { padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: rgba(255, 255, 255, 0.08); color: var(--text-primary); }
            .change-pass-btn { background: none; border: none; color: var(--accent); cursor: pointer; font-size: 14px; margin: 10px 0; padding: 0; text-align: left; }
            .password-fields { display: none; }
            .password-fields.active { display: block; }
            .save-btn { margin-top: 8px; padding: 12px; border: none; border-radius: 10px; background: var(--gradient); color: white; font-weight: 600; cursor: pointer; width: 100%; }
            @media (max-width: 900px) {
                .profile-layout { grid-template-columns: 1fr; }
                .info-grid { grid-template-columns: 1fr; }
            }
        `;
    }

    render(): string {
        const { user, isLoading, isModalOpen, isPasswordFieldsOpen, isSaving } = this.state;
        const safeUser = user ?? EMPTY_USER;

        if (isLoading) {
            return `
                <div class="container">
                    <div class="loading-card">
                        <p class="loading-text">Загрузка профиля...</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="container">
                <button class="back-btn" id="goBack" type="button">
                    <i class="fas fa-arrow-left"></i> Вернуться в магазин
                </button>

                <div class="profile-layout">
                    <div class="profile-card">
                        <div class="profile-avatar"><i class="fas fa-user"></i></div>
                        <h2>${safeUser.name || "Пользователь"}</h2>
                        <p>${safeUser.email || "Email не указан"}</p>
                        <button class="edit-btn" id="openEditModal" type="button">
                            <i class="fas fa-user-edit"></i> Изменить данные
                        </button>
                    </div>

                    <div class="profile-info-block">
                        <h2>Информация о пользователе</h2>
                        <div class="info-grid">
                            <div class="info-item">
                                <span>Имя</span>
                                <p>${safeUser.name || "Не указано"}</p>
                            </div>
                            <div class="info-item">
                                <span>Email</span>
                                <p>${safeUser.email || "Не указано"}</p>
                            </div>
                            <div class="info-item">
                                <span>Телефон</span>
                                <p>${safeUser.phone || "Не указано"}</p>
                            </div>
                            <div class="info-item">
                                <span>Логин</span>
                                <p>${safeUser.login || "Не указано"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal ${isModalOpen ? "show" : ""}" id="editModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Редактировать профиль</h3>
                        <button class="close-btn" id="closeModal" type="button">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <form id="editForm">
                        <div class="form-group">
                            <label for="profile-name">Имя</label>
                            <input id="profile-name" type="text" name="name" value="${safeUser.name}" required>
                        </div>

                        <div class="form-group">
                            <label for="profile-email">Email</label>
                            <input id="profile-email" type="email" name="email" value="${safeUser.email}" required>
                        </div>

                        <button type="button" class="change-pass-btn" id="togglePassword">
                            ${isPasswordFieldsOpen ? "Не менять пароль" : "Изменить пароль"}
                        </button>

                        <div id="passwordFields" class="password-fields ${isPasswordFieldsOpen ? "active" : ""}">
                            <div class="form-group">
                                <label for="profile-password">Новый пароль</label>
                                <input id="profile-password" type="password" name="newPassword" minlength="4">
                            </div>

                            <div class="form-group">
                                <label for="profile-confirm-password">Подтвердите пароль</label>
                                <input id="profile-confirm-password" type="password" name="confirmPassword" minlength="4">
                            </div>
                        </div>

                        <button type="submit" class="save-btn" ${isSaving ? "disabled" : ""}>
                            ${isSaving ? "Сохранение..." : "Сохранить"}
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    protected addMove(): void {
        this.element.querySelector("#goBack")?.addEventListener("click", () => {
            router.navigate("/");
        });

        this.element.querySelector("#openEditModal")?.addEventListener("click", () => {
            this.setState({ isModalOpen: true });
        });

        this.element.querySelector("#closeModal")?.addEventListener("click", () => {
            this.closeModal();
        });

        this.element.querySelector("#editModal")?.addEventListener("click", (event) => {
            if (event.target === event.currentTarget) {
                this.closeModal();
            }
        });

        this.element.querySelector("#togglePassword")?.addEventListener("click", () => {
            this.setState({
                isPasswordFieldsOpen: !this.state.isPasswordFieldsOpen
            });
        });

        const form = this.element.querySelector("#editForm");
        if (form instanceof HTMLFormElement) {
            form.addEventListener("submit", (event) => {
                void this.handleSubmit(event);
            });
        }
    }

    private closeModal(): void {
        this.setState({
            isModalOpen: false,
            isPasswordFieldsOpen: false,
            isSaving: false
        });
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        const form = event.currentTarget;
        if (!(form instanceof HTMLFormElement) || !this.state.user || this.state.isSaving) {
            return;
        }

        const formData = new FormData(form);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const newPassword = String(formData.get("newPassword") ?? "").trim();
        const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

        if (!name || !email) {
            alert("Заполните имя и email");
            return;
        }

        if (this.state.isPasswordFieldsOpen) {
            if (!newPassword) {
                alert("Введите новый пароль");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("Пароли не совпадают");
                return;
            }
        }

        this.setState({ isSaving: true });

        try {
            const updatePayload: Partial<User> = {
                name,
                email
            };

            if (this.state.isPasswordFieldsOpen && newPassword) {
                updatePayload.password = newPassword;
            }

            await UserService.update(this.state.user.id, updatePayload);

            const freshUser = await UserService.getCurrent();
            const nextUser = freshUser ?? new User({
                ...this.state.user,
                ...updatePayload
            });

            this.setState({
                user: nextUser,
                isSaving: false,
                isModalOpen: false,
                isPasswordFieldsOpen: false
            });

            alert("Данные успешно обновлены");
        } catch (error) {
            console.error("Profile update failed", error);
            this.setState({ isSaving: false });
            alert("Ошибка при обновлении данных");
        }
    }
}
