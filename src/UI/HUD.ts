import styles from "./HUD.module.css";

export default class HUD {
    moveUIContainer: HTMLElement;
    constructor() {
        this.moveUIContainer = createMoveUI();
    }

    showMoveUI() {
        this.moveUIContainer.removeAttribute("hidden");
    }

    hideMoveUI() {
        this.moveUIContainer.setAttribute("hidden", ""); // hidden by default
    }
}

function createMoveUI() {
    // create wrapper
    const hudContainer = document.createElement("div");
    hudContainer.className = styles.hud;
    hudContainer.setAttribute("hidden", ""); // hidden by default
    document.body.append(hudContainer);
    // create button enviroment
    const btn = document.createElement("button");
    btn.textContent = "Touch Here";
    btn.className = styles.btn;

    btn.onclick = () => console.log("oli");

    hudContainer.append(btn);
    return hudContainer;
}