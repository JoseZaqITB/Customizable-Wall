import Experience from "../../Experience/Experience";
import styles from "./FurnitureUI.module.css"
import sources from "../../Experience/sources";
import StickyObject from "../../Experience/World/Object/StickyObject";
import World from "../../Experience/World/World";
import UI from "../UI";
import type HUD from "../HUD";

const furnitureList = sources.filter((item) => item.type === "gltfModel").map((item) => item.name);

export default class FurnitureUI extends UI {
    hud: HUD;
    constructor() {
        super();
        this.initUI();
        // init properties
        const experience = new Experience();
        this.hud = experience.hud;
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
            
            const iconTitleWrapper = document.createElement("div");
            const icon = document.createElement("div");
            const p = document.createElement("p");
            const addIcon = document.createElement("p");

            iconTitleWrapper.className = styles.iconTitleWrapper;

            addIcon.textContent = "+";
            addIcon.className = styles.addIcon;

            p.textContent = furnitureName;
            icon.className = styles.btnIcon;
            icon.textContent = "🪑";

            iconTitleWrapper.append(icon, p);
            btn.append(iconTitleWrapper, addIcon);

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
                wrapper.classList.remove(styles.hiddenContainer);
                // show ColorUI too
                this.hud.UIList.colorUI.show();
            }
            else {
                this.isHidden = true;
                arrow.className = styles.upArrow;
                wrapper.classList.add(styles.hiddenContainer);
                // hide ColorUI too
                this.hud.UIList.colorUI.hide();
            }
        };
        wrapper.append(hideBtn);

        // add to container
        container.append(nav);

        this.htmlElement = wrapper;

    }

    #handleClick(world: World, furnitureName: string) {
        const checkedRadio: HTMLInputElement | null = document.querySelector('input[name="stick"]:checked');
        const onWall = checkedRadio?.value === "Wall";
        world.addObject(new StickyObject(onWall, furnitureName))
    }

    hide() {
        
    }
}

function createOption(name: string) {
    const radioContainer = document.createElement("div");
    radioContainer.className = styles.radioContainer;

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