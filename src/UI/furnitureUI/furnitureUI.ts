import Experience from "../../Experience/Experience";
import styles from "./FurnitureUI.module.css"
import sources from "../../Experience/sources";
import StickyObject from "../../Experience/World/Object/StickyObject";
import World from "../../Experience/World/World";

const furnitureList = sources.filter((item) => item.type === "gltfModel").map((item) => item.name);

export default class FurnitureUI {
    htmlElement: HTMLElement;
    constructor() {
        this.htmlElement = this.initUI();
    }

    initUI() {
        const experience = new Experience();
        // container
        const container = document.createElement("div");
        container.className = styles.furnitureContainer;

        // furniture list
        const nav = document.createElement("nav");
        const ul = document.createElement("ul");
        nav.append(ul);

        furnitureList.forEach((furnitureName) => {
            const btn = document.createElement("button");
            const li = document.createElement("li");
            btn.className = styles.btn;
            btn.textContent = furnitureName;

            btn.onclick = () => handleClick(experience.world, true, furnitureName);

            ul.append(li);
            li.append(btn);
        });

        // add to container
        container.append(nav);

        return container;

    }
    showUI() {

    }
}

function handleClick(world: World,onWall: boolean,furnitureName: string) {
    world.addObject(new StickyObject(onWall, furnitureName))
}