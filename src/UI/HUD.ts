import Experience from "../Experience/Experience";
import StickyObject from "../Experience/World/Object/StickyObject";
import styles from "./HUD.module.css";
import controlCameraIcon from "../assets/control_camera_icon.svg";

export default class HUD {
    moveUIButton: HTMLButtonElement;
    #experience: Experience;
    #isMoveObjActive = false;
    #btnOffsetX = 0;
    #btnOffsetY = 0;
    constructor() {
        this.#experience = new Experience();
        this.moveUIButton = this.#createMoveUI();
    }

    showMoveUI() {
        this.moveUIButton.classList.remove(styles.hiddenBtn);
    }

    hideMoveUI() {
        this.moveUIButton.classList.add(styles.hiddenBtn); // hidden by default
    }

    update() {
        if (this.#isMoveObjActive)
            this.#updateMove();
    }

    #updateMove() {
        // move button
        const pointerPosition = this.#experience.events.pointerPos;
        const sizes = this.#experience.sizes;
        const btnX = ((pointerPosition.x + 1) / 2) * sizes.width - this.#btnOffsetX;
        const btnY = ((-pointerPosition.y + 1) / 2) * sizes.height - this.#btnOffsetY;

        this.moveUIButton.style.transform = `translate(${btnX}px,${btnY}px)`;
        console.log(this.moveUIButton.style.transform)
        // move obj
        if (this.#experience.world.activeObject instanceof StickyObject)
            this.#experience.world.activeObject.move(pointerPosition);
    }


    #createMoveUI() {
        // create wrapper
        const hudContainer = document.createElement("div");
        hudContainer.className = styles.hud;
        document.body.append(hudContainer);
        // create button enviroment
        const btn = document.createElement("button");
        btn.classList.add(styles.btn);
        btn.classList.add(styles.hiddenBtn);

        // add icon
        const icon = document.createElement("img");
        icon.setAttribute("src", controlCameraIcon);
        btn.append(icon);

        btn.addEventListener("pointerdown", (e) => {
            btn.setPointerCapture(e.pointerId); 
            const rect = btn.getBoundingClientRect();
            this.#btnOffsetX = e.clientX - rect.left;
            this.#btnOffsetY = e.clientY - rect.top;
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

        hudContainer.append(btn);
        return btn;
    }

    #startMovement() {
        // pointer position listener
        if(!this.#isMoveObjActive) return;
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
