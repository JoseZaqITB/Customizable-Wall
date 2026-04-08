import Experience from "../Experience/Experience";
import styles from "./HUD.module.css";
import type UI from "./UI";
import ColorUI from "./colorUI/ColorUI";
import FurnitureUI from "./furnitureUI/furnitureUI";
import MoveUI from "./moveUI/MoveUI";

type HUDUIS = {
    moveUI: MoveUI,
    furnitureUI: FurnitureUI,
    colorUI: ColorUI,
}

export default class HUD {
    #experience: Experience;
    HUDHtmlElement: HTMLElement;
    UIList!: HUDUIS;

    constructor() {
        this.#experience = new Experience();
        // init UIs
        this.HUDHtmlElement = this.#initUI();
        this.#initUIs();
    }



    update() {
        if(this.UIList)
            this.UIList.moveUI.update();
    }

    #initUIs() {
        this.#experience.resources.on("ready", () => {
            this.UIList = {
                furnitureUI: new FurnitureUI(),
                moveUI: new MoveUI(),
                colorUI: new ColorUI(),
            };

            Object.values(this.UIList).forEach((UI) => this.addUI(UI));
        })
    }

    addUI(UI: UI) {
        this.HUDHtmlElement.append(UI.htmlElement);
    }



    #initUI() {
        // create wrapper
        const hudContainer = document.createElement("div");
        hudContainer.className = styles.hud;
        document.body.append(hudContainer);
        return hudContainer;
    }

    dispose() {
        Object.values(this.UIList).forEach((ui) => ui.dispose());
    }


}
