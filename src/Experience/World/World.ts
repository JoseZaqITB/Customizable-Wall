import * as THREE from 'three';
import Experience from '../Experience.js'
import type Resources from '../Utils/Resources.js';
import Wall from './Object/Wall.js';
import Floor from './Object/Floor.ts';
import Light from './Light.ts';
import StickyObject from './Object/StickyObject.ts';
import StaticObject from './Object/StaticObject.ts';
import PBRModel from './Object/PBRModel.ts';

export default class World {
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    #objectList: StickyObject[] = [];
    meshList: (THREE.Mesh | THREE.Group)[] = [];
    activeObject: (StaticObject | PBRModel) | undefined;

    // static objs
    wall: Wall | undefined;
    floor: Floor | undefined;

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources


        const light = new Light();
        // Wait for resources
        this.resources.on('ready', () => {
            // main objects
            this.wall = new Wall(4, 2.5, 0.25);
            this.floor = new Floor(-this.wall.height * 0.5, 4, 4, 0.25);

            this.wall.setZ(- this.floor.depth * 0.5);
            // Setup
            const livingRoomSetup = furnitureSeed();
            livingRoomSetup.forEach((fur) => this.addObject(fur));
        })
        // events
        this.experience.events.addEventListener("objectClicked", (obj) => this.#updateActiveObject(obj));
    }

    update() {
        this.#objectList.forEach(object => object.update());
        /* if(this.fox)
            this.fox.update() */
    }

    addObject(obj: StickyObject) {
        this.#objectList.push(obj);
        this.meshList.push(obj.instance);
    }

    deleteActiveObject() {
        // remove from list
        this.#objectList = this.#objectList.filter((object) =>
            object.instance.name != this.activeObject?.instance.name
        );

        this.meshList = this.meshList.filter((object) =>
            object.name != this.activeObject?.instance.name
        );
        // delete object
        this.activeObject?.dispose();
    }

    #updateActiveObject(obj: THREE.Object3D | undefined) {
        // set default color to all objects
        this.#objectList.forEach((object) => object.setInactive())


        // set the active object
        if (obj) {
            // update active object
            const newActiveObject = this.#objectList.find((object) => object.instance.name === obj.name);
            this.activeObject = newActiveObject;
            // change color
            newActiveObject?.setActive();
            // show ui
            this.experience.hud.UIList.moveUI.show();
        } else {
            this.activeObject = undefined;
            this.experience.hud.UIList.moveUI.hide();
        }
    }


}

function furnitureSeed() {
    const array = [];
    //
    array.push(new StickyObject(false, "sofa", new THREE.Vector3(0, 0, 1.5), new THREE.Vector3(0, Math.PI, 0)));
    array.push(new StickyObject(false, "sofa", new THREE.Vector3(1.25, 0, 0.25), new THREE.Vector3(0, - Math.PI * 0.5, 0)));
    array.push(new StickyObject(false, "woodCabinet", new THREE.Vector3(0, 0, -1.5)));
    array.push(new StickyObject(true, "television", new THREE.Vector3(0, -0.6, 0)));
    array.push(new StickyObject(true, "picture", new THREE.Vector3(0.6, 0.25, 0)));
    array.push(new StickyObject(true, "picture", new THREE.Vector3(-0.6, 0.25, 0)));
    array.push(new StickyObject(true, "plant", new THREE.Vector3(-1, -0.6, 0)));
    array.push(new StickyObject(true, "plant", new THREE.Vector3(1, -0.6, 0)));
    array.push(new StickyObject(false, "table", new THREE.Vector3(0, 0, 0)));
    //
    return array;

}