import * as THREE from 'three';
import Experience from '../Experience.js'
import type Resources from '../Utils/Resources.js';
import Wall from './Object/Wall.js';
import Floor from './Object/Floor.ts';
import Light from './Light.ts';
import StickyObject from './Object/StickyObject.ts';
import Object3D from './Object/Object3D.ts';
import PBRModel from './Object/PBRModel.ts';

export default class World {
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    #objectList: (Object3D | PBRModel)[] = [] ;
    meshList: THREE.Mesh[] = [];
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        // objects
        const wall = new Wall();
        const floor = new Floor();
        const light = new Light();
        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.#addObject(
                new StickyObject("chairModel", "chairTxt_diff", "chairTxt_arm", "chairTxt_nor")
            );

        })
        // events
        this.experience.events.addEventListener("objectClicked", (obj) => {(obj.material as THREE.MeshStandardMaterial).color = new THREE.Color(0xff8800)});
    }

    update() {
        this.#objectList.forEach(object => object.update());
        /* if(this.fox)
            this.fox.update() */
    }

    #addObject(obj: Object3D | PBRModel) {
        this.#objectList.push(obj);
        this.meshList.push(obj.instance);
    }
}