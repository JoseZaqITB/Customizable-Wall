import UI from "../UI";
import StickyObject from "../../Experience/World/Object/StickyObject";
import controlCameraIcon from "../../assets/control_camera_icon.svg";
import { Vector3 } from "three";
import styles from "./MovUI.module.css";
import Experience from "../../Experience/Experience";

export default class MoveUI extends UI {
    #experience: Experience;
    #isMoveObjActive = false;
    #btnOffsetX = 0;
    #btnOffsetY = 0;
    constructor() {
        super();
        // set properties
        this.#experience = new Experience();
    }

    initUI() {
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

        this.htmlElement = btn;
    }

    #updateMove() {
        // move button
        const pointerPosition = this.#experience.events.pointerPos;
        const sizes = this.#experience.sizes;
        const btnX = ((pointerPosition.x + 1) / 2) * sizes.width - this.#btnOffsetX;
        const btnY = ((-pointerPosition.y + 1) / 2) * sizes.height - this.#btnOffsetY;

        this.htmlElement.style.transform = `translate(${btnX}px,${btnY}px)`;
        // move obj
        if (this.#experience.world.activeObject instanceof StickyObject)
            this.#experience.world.activeObject.move(pointerPosition);
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

    show() {
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
                if (world.activeObject.stickZ)
                    this.htmlElement.style.transform = `translate(${initPos?.x}px, ${initPos?.y}px)`
                else
                    this.htmlElement.style.transform = `translate(${initPos?.x}px, ${initPos?.z}px)`
            }
        }
        // remove hidden class
        this.htmlElement.classList.remove(styles.hiddenBtn);
    }

    hide() {
        this.htmlElement.classList.add(styles.hiddenBtn); // hidden by default
    }

    update() {
        if (this.#isMoveObjActive)
            this.#updateMove();
    }
}