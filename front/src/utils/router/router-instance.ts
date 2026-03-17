import { Router } from "./Router";
import { Main } from "../../components/main";
import { AuthComponent } from "../../components/AuthComponent";
import { RegisterComponent } from "../../components/RegisterComponent";

export const router = new Router("app-root");

export const initApp = () => {
    router
        .addRoute("/", Main)
        .addRoute("/login", AuthComponent)
        .addRoute("/register", RegisterComponent)
        .start();
};