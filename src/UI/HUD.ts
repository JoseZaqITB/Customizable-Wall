import styles from "./HUD.module.css";
import type UI from "./UI";
import FurnitureUI from "./furnitureUI/furnitureUI";
import MoveUI from "./moveUI/MoveUI";

type HUDUIS = {
    moveUI: MoveUI,
    furnitureUI: FurnitureUI,
}

export default class HUD {
    HUDHtmlElement: HTMLElement;
    UIList!: HUDUIS;
   
    constructor() {
        
        // init UIs
        this.HUDHtmlElement = this.#initUI();
        this.#initUIs(); 
    }

    

    update() {
        this.UIList.moveUI.update();
    }

    #initUIs() {
        this.UIList = {
            furnitureUI: new FurnitureUI(),
            moveUI: new MoveUI(),
        };

        Object.values(this.UIList).forEach((UI) => this.addUI(UI));
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

   
}
