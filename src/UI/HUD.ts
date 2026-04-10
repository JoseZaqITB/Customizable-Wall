import Experience from "../Experience/Experience";
import styles from "./HUD.module.css";
import type UI from "./UI";
import ColorUI from "./colorUI/ColorUI";
import FurnitureUI from "./furnitureUI/FurnitureUI";
import LoadingUI from "./loadingUI/LoadingUI";
import ObjEditionUI from "./objEditionUI/ObjEditionUI";

type HUDUIS = {
    moveUI: ObjEditionUI,
    furnitureUI: FurnitureUI,
    colorUI: ColorUI,
    LoadingUI: LoadingUI,
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

        // remove loading when resources ready
        this.#experience.resources.on("ready", () => {
            this.removeUI(this.UIList.LoadingUI);
        });
    }



    update() {
        if(this.UIList)
            this.UIList.moveUI.update();
    }

    #initUIs() {
        // add loading first
        const loadingUI = new LoadingUI();
        this.addUI(loadingUI);
        // then the rest when ready
        this.#experience.resources.on("ready", () => {
            this.UIList = {
                furnitureUI: new FurnitureUI(),
                moveUI: new ObjEditionUI(),
                colorUI: new ColorUI(),
                LoadingUI: loadingUI,
            };

            Object.values(this.UIList).filter((ui) => ui !== loadingUI).forEach((UI) => this.addUI(UI));
        })
    }

    addUI(UI: UI) {
        this.HUDHtmlElement.append(UI.htmlElement);
    }

    removeUI(UI: UI) {
        UI.hide();
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
