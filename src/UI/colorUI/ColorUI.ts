import { Color } from "three";
import Experience from "../../Experience/Experience";
import UI from "../UI";
import styles from "./ColorUI.module.css";

type inputColor = "wall" | "floor" | "bg";

export default class ColorUI extends UI {
    #experience: Experience;
    #disposeList: { input: HTMLInputElement, eventName: string, handleEvent: (e: Event) => void }[] = [];
    constructor() {
        super();
        // set properties
        this.#experience = new Experience();
        // initialize UI
        this.initUI();
    }

    initUI() {
        const colorUIContainer = document.createElement("div");
        colorUIContainer.className = styles.colorUIContainer;

        // create 3 input colors -> background, wall and floor
        const wallColorContainer = this.#createColorContainer("wall");
        const floorColorContainer = this.#createColorContainer("floor");
        const bgnColorContainer = this.#createColorContainer("bg");

        colorUIContainer.append(wallColorContainer, floorColorContainer, bgnColorContainer);

        this.htmlElement = colorUIContainer;
    }

    #createColorContainer(label: inputColor) {
        const colorWrapper = document.createElement("div");
        colorWrapper.className = styles.inputColorWrapper;

        const colorInput = document.createElement("input");
        colorInput.id = label;
        colorInput.type = "color";


        // initialize color and add listener for changes
        let handleEvent: (e: Event) => void;
        switch (label) {
            case "wall":
                // initialized
                colorInput.value = this.#experience.world.wall?.color || "";
                // listener
                handleEvent = (e: Event) => {
                    if (this.#experience.world.wall)
                        this.#experience.world.wall.color = (e.target as HTMLInputElement).value;
                };
                colorInput.addEventListener("change", handleEvent);
                this.#disposeList.push({ input: colorInput, eventName: "change", handleEvent });

                break;

            case "floor":
                // initialized
                colorInput.value = this.#experience.world.floor?.color || "";

                // listener
                handleEvent = (e: Event) => {
                    if (this.#experience.world.floor)
                        this.#experience.world.floor.color = (e.target as HTMLInputElement).value;
                }
                colorInput.addEventListener("change", handleEvent);
                this.#disposeList.push({ input: colorInput, eventName: "change", handleEvent });

                break;
            case "bg":
                // initialized
                const color = new Color();
                this.#experience.renderer.instance.getClearColor(color);
                colorInput.value =  `#${color.getHexString()}`;
                // listener
                handleEvent = (e) => {
                    this.#experience.renderer.instance.setClearColor((e.target as HTMLInputElement).value);
                }
                colorInput.addEventListener("change", handleEvent);
                this.#disposeList.push({ input: colorInput, eventName: "change", handleEvent });
        }

        const colorLabel = document.createElement("label");
        colorLabel.htmlFor = label;
        colorLabel.textContent = label;

        colorWrapper.append(colorLabel, colorInput);

        return colorWrapper;
    }

    dispose() {
        this.#disposeList.forEach((dispose) => {
            dispose.input.removeEventListener(dispose.eventName, dispose.handleEvent)
        });
    }

    hide() {
        this.htmlElement.classList.add(styles.hiddenContainer);
    }

    show() {
        this.htmlElement.classList.remove(styles.hiddenContainer);        
    }
}

