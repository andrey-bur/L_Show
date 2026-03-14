import { Main } from "./src/components/main";

class App {
    private main: Main;

    constructor() {
        this.main = new Main();
        this.init();
    }

    private init() {
        this.main.mount(document.body);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new App();
});
