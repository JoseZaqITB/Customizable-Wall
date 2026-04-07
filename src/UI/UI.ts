
export default class UI {
    htmlElement!: HTMLElement | DocumentFragment;
    isHidden = false;
    constructor() {
        //this.initUI();
    }

    initUI() {
        // to overide
        throw new Error("Method initUI must be implemented.")
    }

    update() {}

    show(){}

    hide(){}
}