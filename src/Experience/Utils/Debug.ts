import GUI from 'lil-gui'
import Experience from '../Experience';
import { Color } from 'three';

export default class Debug {
    active: boolean;
    ui?: GUI;
    experience: Experience;
    constructor() {
        this.experience = new Experience();
        this.active = window.location.hash === '#debug'

        if (this.active) {
            this.ui = new GUI();

            // props
            const color = new Color();
            this.experience.renderer.instance.getClearColor(color)
            const debugObj = {
                backgroundColor: color,

            }
            this.ui.addColor(debugObj, "backgroundColor")
                .onChange((value: Color) => {
                    this.experience.renderer.instance.setClearColor(value)
                });
        }
    }
}