import { Router } from "./Router";
import { Main } from "../../components/main";
import { AuthComponent } from "../../components/AuthComponent";
import { RegisterComponent } from "../../components/RegisterComponent";
import {Profile}from "../../components/Profile"
import { Checkout } from "../../components/Checkout";

export const router = new Router("app-root");

export const initApp = () => {
    router
        .addRoute("/", Main)
        .addRoute("/login", AuthComponent)
        .addRoute("/register", RegisterComponent)
        .addRoute("/checkout", Checkout)
        .addRoute("/profile",Profile)
        .start();
};