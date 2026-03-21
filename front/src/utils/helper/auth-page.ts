import { router } from "../router/router-instance";

type AuthPageStylesOptions = {
    decorImage: string;
    containerMaxWidth: string;
    formSectionPadding: string;
    formLayoutCss: string;
    extraCss?: string;
};

type AuthPageRenderOptions = {
    title: string;
    subtitle: string;
    decorText: string;
    formId: string;
    formContent: string;
    footerPrompt: string;
    footerActionId: string;
    footerActionText: string;
};

/**
 * Builds reusable auth page CSS with configurable layout.
 * @param options Style options for a specific auth page variant.
 * @returns CSS text.
 */
export function buildAuthPageStyles(options: AuthPageStylesOptions): string {
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
            max-width: ${options.containerMaxWidth};
            background: #ffffff;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
            position: relative;
        }

        .auth-decor {
            flex: 1;
            background: linear-gradient(rgba(45, 0, 5, 0.85), rgba(10, 10, 10, 0.95)),
                        url('${options.decorImage}') center/cover;
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
            padding: ${options.formSectionPadding};
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
${options.formLayoutCss}
        }

        .input-group {
            display: flex;
            flex-direction: column;
        }

        .input-group label {
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

        .auth-footer-action {
            color: #2d0005;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            margin-left: 5px;
            transition: color 0.3s ease;
        }

        .auth-footer-action:hover {
            color: #a52a2a;
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

${options.extraCss ?? ""}
    `;
}

/**
 * Renders auth page layout with dynamic title, content and footer action.
 * @param options Render options.
 * @returns HTML string.
 */
export function renderAuthPage(options: AuthPageRenderOptions): string {
    return `
            <div class="auth-container">
                <div class="auth-decor">
                    <div class="logo-big" data-auth-home>
                        <i class="fas fa-wine-bottle"></i>
                        <span>Wine & Spirits</span>
                    </div>
                    <p>${options.decorText}</p>
                </div>

                <div class="auth-form-section">
                    <div class="auth-header">
                        <h2>${options.title}</h2>
                        <p>${options.subtitle}</p>
                    </div>

                    <form id="${options.formId}" class="auth-form">
                        ${options.formContent}
                    </form>

                    <div class="auth-footer">
                        ${options.footerPrompt} <span id="${options.footerActionId}" class="auth-footer-action">${options.footerActionText}</span>
                    </div>
                </div>
            </div>
        `;
}

/**
 * Binds common auth-page navigation events.
 * @param root Root auth page element.
 * @param footerActionSelector Selector for footer CTA element.
 * @param footerActionPath Route to navigate on footer CTA click.
 */
export function bindAuthPageNavigation(
    root: HTMLElement,
    footerActionSelector: string,
    footerActionPath: string
): void {
    root.querySelector("[data-auth-home]")?.addEventListener("click", () => {
        router.navigate("/");
    });

    root.querySelector(footerActionSelector)?.addEventListener("click", () => {
        router.navigate(footerActionPath);
    });
}
