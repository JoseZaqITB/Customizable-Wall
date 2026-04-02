import type { Vector2 } from "three";
import PBRModel from "./PBRModel";
import Experience from "../../Experience";

export default class StickyObject extends PBRModel {
    stickY: boolean;
    #experience: Experience;
    constructor(name: string, diff?: string, arm?: string, normal?: string, stickY: boolean = true) {
        super(name, diff, arm, normal);
        // set properties
        this.stickY = stickY;
        this.#experience = new Experience();
    }

    move(position2D: Vector2) {
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
}