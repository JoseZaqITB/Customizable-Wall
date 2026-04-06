import Experience from "../Experience/Experience";
import StickyObject from "../Experience/World/Object/StickyObject";
import styles from "./HUD.module.css";
import controlCameraIcon from "../assets/control_camera_icon.svg";
import { Vector3 } from "three";
import FurnitureUI from "./furnitureUI/furnitureUI";

export default class HUD {
    HUDHtmlElement: HTMLElement;
    moveUIButton: HTMLButtonElement;
    #experience: Experience;
    #isMoveObjActive = false;
    #btnOffsetX = 0;
    #btnOffsetY = 0;
    constructor() {
        
        // init UIs
        this.HUDHtmlElement = this.#initUI();
        this.#initUIs(); //OJO: ADD UIs
        //
        this.#experience = new Experience();
        this.moveUIButton = this.#createMoveUI();
    }

    showMoveUI() {
        // reset btn pos according to the obj pos
        if(this.#experience.world.activeObject) {
            const world = this.#experience.world;
            const sizes = this.#experience.sizes;
            const maxWorld3 = new Vector3(world.wall!.width, world.wall!.height, world.floor!.depth);
            const maxWindow3 = new Vector3(sizes.width, sizes.height, sizes.height);
            const initPos = world.activeObject!.instance.position.clone();
            initPos.y *= -1;
            initPos.add(maxWorld3.clone().divideScalar(2));
            
            initPos.divide(maxWorld3);
            initPos.multiply(maxWindow3);
            if (world.activeObject instanceof StickyObject) {
                if (world.activeObject.stickY)
                    this.moveUIButton.style.transform = `translate(${initPos?.x}px, ${initPos?.y}px)`
                else
                    this.moveUIButton.style.transform = `translate(${initPos?.x}px, ${initPos?.z}px)`
            }
        }
        // remove hidden class
        this.moveUIButton.classList.remove(styles.hiddenBtn);
    }

    hideMoveUI() {
        this.moveUIButton.classList.add(styles.hiddenBtn); // hidden by default
    }

    update() {
        if (this.#isMoveObjActive)
            this.#updateMove();
    }

    #initUIs() {
        const furnitureUI = new FurnitureUI();
        this.addUI(furnitureUI);
    }

    addUI(UI: FurnitureUI) {
        this.HUDHtmlElement.append(UI.htmlElement);
    }

    #updateMove() {
        // move button
        const pointerPosition = this.#experience.events.pointerPos;
        const sizes = this.#experience.sizes;
        const btnX = ((pointerPosition.x + 1) / 2) * sizes.width - this.#btnOffsetX;
        const btnY = ((-pointerPosition.y + 1) / 2) * sizes.height - this.#btnOffsetY;

        this.moveUIButton.style.transform = `translate(${btnX}px,${btnY}px)`;
        // move obj
        if (this.#experience.world.activeObject instanceof StickyObject)
            this.#experience.world.activeObject.move(pointerPosition);
    }

    #initUI() {
        // create wrapper
        const hudContainer = document.createElement("div");
        hudContainer.className = styles.hud;
        document.body.append(hudContainer);
        return hudContainer;
    }
    #createMoveUI() {
        
        // create button enviroment
        const btn = document.createElement("button");
        btn.classList.add(styles.btn);
        btn.classList.add(styles.hiddenBtn);

        // add icon
        const icon = document.createElement("img");
        icon.setAttribute("src", controlCameraIcon);
        btn.append(icon);

        btn.addEventListener("pointerdown", (e) => {
            // avoid werird pointer behaviour
            btn.setPointerCapture(e.pointerId);
            // put pos from the center of the btn
            const rect = btn.getBoundingClientRect();
            this.#btnOffsetX = e.clientX - rect.left;
            this.#btnOffsetY = e.clientY - rect.top;
            // set movement available
            this.#isMoveObjActive = true;
        });
        btn.addEventListener("pointermove", () => {
            this.#startMovement();
        });
        btn.addEventListener("pointerup", (e) => {
            btn.releasePointerCapture(e.pointerId);
            this.#stopMovement()
        });
        btn.addEventListener("pointerleave", (e) => {
            btn.releasePointerCapture(e.pointerId);
            this.#stopMovement()
        });

        this.HUDHtmlElement.append(btn);
        return btn;
    }

    #startMovement() {
        // pointer position listener
        if (!this.#isMoveObjActive) return;
        const events = this.#experience.events;
        events.addEventListener("pointerMove");
    }

    #stopMovement() {
        const events = this.#experience.events;
        events.removeEventListener("pointerMove");
        // move obj
        this.#isMoveObjActive = false;
    }
}
