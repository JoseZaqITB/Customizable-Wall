import UI from "../UI";
import styles from "./Loading.module.css";

export default class LoadingUI extends UI{
    constructor() {
        super();
        this.initUI();
    }

    initUI() {
        const wrapper = document.createElement("div");
        wrapper.className = styles.loadingContainer;

        const loader = document.createElement("div");
        loader.className = styles.loader;

        wrapper.append(loader);
        
        this.htmlElement = wrapper;
    }

    hide() {
        this.htmlElement.classList.add(styles.hide);
    }
}