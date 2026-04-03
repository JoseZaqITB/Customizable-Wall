import * as THREE from "three";
import PBRModel from "./PBRModel";
import Experience from "../../Experience";

export default class StickyObject extends PBRModel {
    stickY: boolean;
    #experience: Experience;
    constructor(stickY: boolean = true,name: string, diff?: string, arm?: string, normal?: string) {
        super(name, diff, arm, normal);
        // set properties
        this.stickY = stickY;
        this.#experience = new Experience();
        
        this.#initPosition();
    }

    move(position2D: THREE.Vector2) {
        if(!this.#experience.world.wall || !this.#experience.world.floor) return
        if (this.stickY) {
            this.instance.position.y = position2D.y * this.#experience.world.wall.height * 0.5;
            this.instance.position.x = position2D.x * this.#experience.world.wall.width * 0.5;
        } else {
            this.instance.position.z = -position2D.y * this.#experience.world.floor.depth * 0.5;
            this.instance.position.x = position2D.x * this.#experience.world.floor.width * 0.5;
        }
    }

    update() {

    }

    #initPosition() {
        if(!this.#experience.world.wall || !this.#experience.world.floor) return;
        // get dimensions
        //this.instance.geometry.computeBoundingBox();
        const box = new THREE.Box3().setFromObject(this.instance);
        const size = new THREE.Vector3();
        box.getSize(size);
        // set new position
        if (this.stickY){
            const wall = this.#experience.world.wall;
            this.instance.position.z = wall.instance.position.z + wall.depth / 2 + size.z / 2;
        } else {
            const floor = this.#experience.world.floor;
            this.instance.position.y = floor.instance.position.y + floor.height / 2;
        }
    }
}