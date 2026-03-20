export abstract class Component<T extends object> {
    protected element: HTMLElement;
    protected state: T;
    private static styleRegistry: Set<string> = new Set();

    constructor(tag: string, initialState: T, className?: string) {
        this.element = document.createElement(tag);
        this.state = initialState;
        if (className) {
            this.element.className = className;
        }
    }

    public setState(newState: Partial<T>): void {
        this.state = { ...this.state, ...newState };
        this.update();
    }

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

    public mount(container: HTMLElement): void {
        this.update(); 
        container.appendChild(this.element);
    }

    public unmount(): void {
        this.beforeUnmount();
        this.element.remove();
    }

    protected addMove(): void { }

    protected beforeUnmount(): void { }

    public getElement(): HTMLElement {
        return this.element;
    }
}
