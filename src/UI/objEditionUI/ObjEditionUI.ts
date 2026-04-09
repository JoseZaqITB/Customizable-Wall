import UI from "../UI";
import StickyObject from "../../Experience/World/Object/StickyObject";
import controlCameraIcon from "../../assets/control_camera_icon.svg";
import rotateIcon from "../../assets/rotate_auto_24dp_FFFBEB_FILL0_wght400_GRAD0_opsz24.svg";
import deleteIcon from "../../assets/delete_24dp_BB271A_FILL0_wght400_GRAD0_opsz24.svg";
import { Vector2, Vector3 } from "three";
import styles from "./ObjEditionUI.module.css";
import Experience from "../../Experience/Experience";

type activeActionType = "movement" | "rotation";

export default class ObjEditionUI extends UI {
    movementBtn!: HTMLElement;
    #experience: Experience;
    #isObjActive = false;
    #btnOffsetX = 0;
    #btnOffsetY = 0;
    activeAction: activeActionType = "movement";
    selectRotationbtn!: HTMLButtonElement;
    selectMovementbtn!: HTMLButtonElement;

    constructor() {
        super();

        this.initUI();
        // set properties
        this.#experience = new Experience();
    }

    initUI() {
        /* WRAPPER */
        const wrapper = document.createElement("div");
        wrapper.classList.add(styles.hiddenBtn);
        /*MOVMENT BUTTON*/
        const moveBtn = createIconButton(controlCameraIcon);
        moveBtn.classList.add(styles.moveBtn);

        moveBtn.addEventListener("pointerdown", (e) => {
            // avoid werird pointer behaviour
            moveBtn.setPointerCapture(e.pointerId);
            // put pos from the center of the btn
            const rect = moveBtn.getBoundingClientRect();
            this.#btnOffsetX = e.clientX - rect.left;
            this.#btnOffsetY = e.clientY - rect.top;
            // set movement available
            this.#isObjActive = true;
        });
        moveBtn.addEventListener("pointermove", () => {
            this.#startMovement();
        });
        moveBtn.addEventListener("pointerup", (e) => {
            moveBtn.releasePointerCapture(e.pointerId);
            this.#stopMovement()
        });
        moveBtn.addEventListener("pointerleave", (e) => {
            moveBtn.releasePointerCapture(e.pointerId);
            this.#stopMovement()
        });

        // save properties
        this.movementBtn = moveBtn;

        /*SELECTION OF TYPE OF ACTION*/
        const btnGroup = this.#createButtonGroup();

        /* SAVE */ 
        //add all to wrapper
        wrapper.append(moveBtn, btnGroup);
        // save wrapper
        this.htmlElement = wrapper;
    }

    #createButtonGroup() {
        // create elements
        const btnGroup = document.createElement("div");
        btnGroup.className = styles.btnGroup;

        /* MOVE AND ROTATE ACTION */
        const selectMovementbtn = createIconButton(controlCameraIcon);
        const selectRotationbtn = createIconButton(rotateIcon);

        // handle clicks
        selectMovementbtn.onclick = () => this.#setActiveAction("movement");
        selectRotationbtn.onclick = () => this.#setActiveAction("rotation");

        this.selectMovementbtn = selectMovementbtn;
        this.selectRotationbtn = selectRotationbtn;

        this.#updateActiveButton();

        /*REMOVE ACTION*/
        const removeBtn = createIconButton(deleteIcon);

        removeBtn.onclick = () => {
            this.#experience.world.deleteActiveObject();
            this.hide();
        };
        /***/
        btnGroup.append(selectMovementbtn, selectRotationbtn, removeBtn);

        return btnGroup;
    }

    #updateActiveButton() {
        if (this.activeAction === "movement") {
            // style
            this.selectRotationbtn.classList.add(styles.inactiveBtn);
            this.selectMovementbtn.classList.remove(styles.inactiveBtn);
            // icon
            this.movementBtn.querySelector("img")?.setAttribute("src", controlCameraIcon);
        }
        else {
            // style
            this.selectMovementbtn.classList.add(styles.inactiveBtn);
            this.selectRotationbtn.classList.remove(styles.inactiveBtn);
            // icon
            this.movementBtn.querySelector("img")?.setAttribute("src", rotateIcon);
        }
    }

    #setActiveAction(currActiveAction: activeActionType) {
        // update variable
        this.activeAction = currActiveAction;
        // update button styles
        this.#updateActiveButton();
        // reset button position
        this.#resetButtonPosition();
    }

    #updateMove(pointerPosition: Vector2) {
        if (this.#experience.world.activeObject instanceof StickyObject)
            this.#experience.world.activeObject.move(pointerPosition);
    }

    #updateRotation(pointerPosition: Vector2) {
        if (this.#experience.world.activeObject instanceof StickyObject)
            this.#experience.world.activeObject.rotate(pointerPosition);
    }

    #updateButtonPosition(pointerPosition: Vector2) {
        // move button
        const sizes = this.#experience.sizes;
        const btnX = ((pointerPosition.x + 1) / 2) * sizes.width - this.#btnOffsetX;
        const btnY = ((-pointerPosition.y + 1) / 2) * sizes.height - this.#btnOffsetY;

        this.movementBtn.style.transform = `translate(${btnX}px,${btnY}px)`;
    }

    #startMovement() {
        // pointer position listener
        if (!this.#isObjActive) return;
        const events = this.#experience.events;
        events.addEventListener("pointerMove");
    }

    #stopMovement() {
        const events = this.#experience.events;
        events.removeEventListener("pointerMove");
        // move obj
        this.#isObjActive = false;
    }

    #resetButtonPosition() {
        if (this.#experience.world.activeObject) {
            if (this.activeAction === "movement") {

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
                    if (world.activeObject.stickOnWall)
                        this.movementBtn.style.transform = `translate(${initPos?.x}px, ${initPos?.y}px)`
                    else
                        this.movementBtn.style.transform = `translate(${initPos?.x}px, ${initPos?.z}px)`
                }
            }
        }
    }

    show() {
        // reset btn pos according to the obj pos
        this.#resetButtonPosition();
        // remove hidden class
        this.htmlElement.classList.remove(styles.hiddenBtn);
    }

    hide() {
        // remove hidden class
        this.htmlElement.classList.add(styles.hiddenBtn); // hidden by default
    }

    update() {
        if (this.#isObjActive) {
            const pointerPosition = this.#experience.events.pointerPos;
            this.#updateButtonPosition(pointerPosition);
            if (this.activeAction === "movement")
                this.#updateMove(pointerPosition);
            else
                this.#updateRotation(pointerPosition);

        }
    }
}


function createIconButton(iconPath: string) {
    const btn = document.createElement("button");
    const moveIcon = document.createElement("img");
    moveIcon.setAttribute("src", iconPath);
    btn.append(moveIcon);

    return btn;
}
