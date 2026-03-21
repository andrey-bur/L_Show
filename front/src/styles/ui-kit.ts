/**
 * Shared UI kit styles used across pages.
 * Includes standardized button variants.
 */
export function getUiKitStyles(): string {
  return `
    .ui-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 12px;
      border: 1px solid transparent;
      font-weight: 600;
      font-size: 0.95rem;
      line-height: 1;
      cursor: pointer;
      transition: all 0.25s ease;
      text-decoration: none;
    }

    .ui-btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .ui-btn--primary {
      background: var(--gradient, linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%));
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    }

    .ui-btn--primary:hover:not(:disabled) {
      transform: translateY(-1px);
      filter: brightness(1.06);
    }

    .ui-btn--secondary {
      background: transparent;
      color: var(--text-primary, #ffffff);
      border-color: var(--border, #2a2a2a);
    }

    .ui-btn--secondary:hover:not(:disabled) {
      background: var(--bg-hover, #252525);
      border-color: var(--text-secondary, #a0a0a0);
    }

    .ui-btn--accent {
      background: #1a1a1a;
      color: #ffffff;
      border-color: #1a1a1a;
    }

    .ui-btn--accent:hover:not(:disabled) {
      background: #2d0005;
      border-color: #2d0005;
    }

    .ui-btn--icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      padding: 0;
    }

    .ui-btn--full {
      width: 100%;
    }
  `;
}
