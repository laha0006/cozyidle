import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";

console.log("main.js loaded");

const app = mount(App, {
    target: document.getElementById("app"),
});

export default app;
