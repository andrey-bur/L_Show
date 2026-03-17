import { Component } from "../Component";

type ComponentConstructor = new () => Component<object>;

export class Router {
    private routes: Map<string, ComponentConstructor> = new Map();
    private container: HTMLElement | null = null;
    private containerId: string;
    private currentComponent: Component<object> | null = null;

    constructor(containerId: string) {
        this.containerId = containerId;
        
        window.addEventListener("DOMContentLoaded", () => {
            this.container = document.getElementById(this.containerId);
            this.setupLinkInterception();
        });

        window.addEventListener("popstate", () => this.handleRoute());
    }

    private setupLinkInterception(): void {
        document.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.getAttribute("href")?.startsWith("/")) {
                e.preventDefault();
                const path = anchor.getAttribute("href")!;
                this.navigate(path);
            }
        });
    }

    public addRoute(path: string, component: ComponentConstructor): this {
        this.routes.set(path, component);
        return this;
    }

    public navigate(path: string): void {
        if (window.location.pathname === path) return;
        window.history.pushState({}, "", path);
        this.handleRoute(); 
    }

    private handleRoute(): void {
        if (!this.container) {
            this.container = document.getElementById(this.containerId);
        }

        const Constructor = this.routes.get(window.location.pathname) || this.routes.get("/");
        if (!Constructor || !this.container) return;

        if (this.currentComponent) {
            this.currentComponent.unmount();
        }

        this.container.innerHTML = "";

        this.currentComponent = new Constructor();
        this.currentComponent.mount(this.container); 
    }

    public start(): void {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            this.handleRoute();
        } else {
            window.addEventListener("DOMContentLoaded", () => this.handleRoute());
        }
    }
}