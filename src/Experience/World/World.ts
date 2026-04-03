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
    #objectList: (Object3D | PBRModel)[] = [];
    meshList: (THREE.Mesh | THREE.Group)[] = [];
    activeObject: (Object3D | PBRModel) | undefined;

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
            this.wall = new Wall();
            this.floor = new Floor(-this.wall.height * 0.5);

            this.wall.setZ(- this.floor.depth * 0.5);
            // Setup
            this.#addObject(
                new StickyObject(false, "chairModel", "chairTxt_diff", "chairTxt_arm", "chairTxt_nor")
            );
            this.#addObject(
                new StickyObject(true, "picture"),
            )

        })
        // events
        this.experience.events.addEventListener("objectClicked", (obj) => this.#updateActiveObject(obj));
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

    #updateActiveObject(obj: THREE.Object3D | undefined) {
        // set default color to all objects
        this.meshList.forEach((mesh) => {
            if (mesh instanceof THREE.Mesh)
                (mesh.material as THREE.MeshStandardMaterial).color = new THREE.Color();
            else {
                ((mesh.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new THREE.Color();
            }
        })

        // set the active object
        if (obj) {
            // change color
            const parseObject = obj instanceof THREE.Mesh ?
                obj as THREE.Mesh : obj.children[0] as THREE.Mesh
            (parseObject.material as THREE.MeshStandardMaterial).color = new THREE.Color(0xff8800)
            // update active object
            const newActiveObject = this.#objectList.find((object) => object.instance.name === obj.name);
            this.activeObject = newActiveObject;
            // show ui
            this.experience.hud.showMoveUI();
        } else {
            this.activeObject = undefined;
            this.experience.hud.hideMoveUI();
        }
    }
}