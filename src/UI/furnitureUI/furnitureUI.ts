import Experience from "../../Experience/Experience";
import styles from "./FurnitureUI.module.css"
import sources from "../../Experience/sources";
import StickyObject from "../../Experience/World/Object/StickyObject";
import World from "../../Experience/World/World";

const furnitureList = sources.filter((item) => item.type === "gltfModel").map((item) => item.name);

export default class FurnitureUI {
    htmlElement: HTMLElement;
    isHidden = false;
    constructor() {
        this.htmlElement = this.initUI();
    }

    initUI() {
        const experience = new Experience();
        // container
        const container = document.createElement("div");
        const wrapper = document.createElement("div");
        container.className = styles.furnitureContainer;
        wrapper.className = styles.wrapper;
        wrapper.append(container);

        // furniture list
        const nav = document.createElement("nav");
        const ul = document.createElement("ul");
        ul.className = styles.btnContainer;
        nav.append(ul);

        furnitureList.forEach((furnitureName) => {
            const li = document.createElement("li");
            li.className = styles.li;
            ul.append(li);

            // btn
            const btn = document.createElement("button");
            btn.className = styles.btn;
            btn.textContent = furnitureName;

            btn.onclick = () => this.#handleClick(experience.world, furnitureName);

            li.append(btn);

        });

        // options
        const form = document.createElement("form");
        form.className = styles.form;
        const radio1Container = createOption("Wall");
        const radio2Container = createOption("Floor");
        form.append(radio1Container, radio2Container);
        container.append(form);

        // hide button container
        const hideBtn = document.createElement("button");

        const arrow = document.createElement("div");
        arrow.className = styles.downArrow;
        hideBtn.append(arrow);

        hideBtn.className = styles.hideBtn;
        hideBtn.onclick = () => {
            if (this.isHidden) {
                this.isHidden = false;
                arrow.className = styles.downArrow;
                container.classList.remove(styles.hiddenContainer);
            }
            else {
                this.isHidden = true;
                arrow.className = styles.upArrow;
                container.classList.add(styles.hiddenContainer);
            }
        };
        wrapper.append(hideBtn);

        // add to container
        container.append(nav);

        return wrapper;

    }
    showUI() {

    }

    #handleClick(world: World, furnitureName: string) {
        const checkedRadio: HTMLInputElement | null = document.querySelector('input[name="stick"]:checked');
        const onWall = checkedRadio?.value === "Wall";
        world.addObject(new StickyObject(onWall, furnitureName))
    }
}

function createOption(name: string) {
    const radioContainer = document.createElement("div");

    const label = document.createElement("label");
    label.htmlFor = name;
    label.textContent = name;

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = name;
    radio.name = "stick";
    radio.value = name;
    radio.checked = true;

    radioContainer.append(radio, label);

    return radioContainer;
}