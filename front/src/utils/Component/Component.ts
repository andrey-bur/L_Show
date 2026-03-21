import { getUiKitStyles } from "../../styles/ui-kit";

export abstract class Component<T extends object> {
    protected element: HTMLElement;
    protected state: T;
    private static styleRegistry: Set<string> = new Set();

    constructor(tag: string, initialState: T, className?: string) {
        this.element = document.createElement(tag);
        this.state = initialState;
        this.applyStyles("ui-kit-styles", getUiKitStyles());
        if (className) {
            this.element.className = className;
        }
    }

    /**
     * Merges partial state and re-renders the component.
     * @param newState Partial state update.
     */
    public setState(newState: Partial<T>): void {
        this.state = { ...this.state, ...newState };
        this.update();
    }

    /**
     * Adds stylesheet to document once per id.
     * @param id Style node id.
     * @param css Raw CSS string.
     */
    public applyStyles(id: string, css: string): void {
        if (Component.styleRegistry.has(id)) return;

        const styleElement = document.createElement('style');
        styleElement.id = id;
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
        
        Component.styleRegistry.add(id);
    }

    private update(): void {
        this.element.innerHTML = this.render();
        this.addMove();
    }

    abstract render(): string;

    /**
     * Mounts component into container and performs initial render.
     * @param container Root container element.
     */
    public mount(container: HTMLElement): void {
        this.update(); 
        container.appendChild(this.element);
    }

    /**
     * Removes component from DOM and runs cleanup hook.
     */
    public unmount(): void {
        this.beforeUnmount();
        this.element.remove();
    }

    protected addMove(): void { }

    protected beforeUnmount(): void { }

    /**
     * Returns the host HTML element for manual integrations.
     * @returns Component root element.
     */
    public getElement(): HTMLElement {
        return this.element;
    }
}
