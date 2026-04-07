import * as THREE from "three";
import PBRModel from "./PBRModel";
import Experience from "../../Experience";

export default class StickyObject extends PBRModel {
    stickOnWall: boolean;
    movementbounderies: { min: THREE.Vector3, max: THREE.Vector3 };
    size = new THREE.Vector3;
    #experience: Experience;

    constructor(
        stickZ: boolean = true,
        name: string,
        position?: THREE.Vector3,
        rotation?: THREE.Vector3,
        diff?: string,
        arm?: string,
        normal?: string
    ) {
        super(name, position, rotation, diff, arm, normal);
        // set properties
        this.stickOnWall = stickZ;
        this.#experience = new Experience();

        // get dimensions
        //this.instance.geometry.computeBoundingBox();
        const box = new THREE.Box3().setFromObject(this.instance);
        box.getSize(this.size);

        const wall = this.#experience.world.wall!;
        const floor = this.#experience.world.floor!;

        const minBndrs = new THREE.Vector3(
            -floor.width * 0.5 + this.size.x * 0.5,
            floor.instance.position.y + floor.height * 0.5 + this.size.y * 0.5,
            wall.instance.position.z + wall.depth * 0.5 + this.size.z * 0.5
        );

        const maxBndrs = new THREE.Vector3(
            floor.width * 0.5 - this.size.x * 0.5,
            wall.height * 0.5 - this.size.y * 0.5,
            floor.depth * 0.5 - this.size.z * 0.5
        );
        this.movementbounderies = { min: minBndrs, max: maxBndrs };


        //
        this.#initPosition();
    }

    move(position2D: THREE.Vector2) {
        // move on the right axis ( Y or Z ) and respecting boundaries
        if (this.stickOnWall) {
            const minY = Math.max(
                this.movementbounderies.min.y,
                position2D.y * this.#experience.world.wall!.height * 0.5
            );
            this.instance.position.y = Math.min(this.movementbounderies.max.y, minY);
        } else {
            const minZ = Math.max(
                this.movementbounderies.min.z,
                -position2D.y * this.#experience.world.floor!.depth * 0.5
            );

            this.instance.position.z = Math.min(this.movementbounderies.max.z, minZ);

        }
        // move on X and respecting boundaries
        const minX = Math.max(
            this.movementbounderies.min.x,
            position2D.x * this.#experience.world.wall!.width * 0.5
        );
        this.instance.position.x = Math.min(this.movementbounderies.max.x, minX);

    }

    rotate(position2D: THREE.Vector2) {
        if (this.stickOnWall) {
            this.instance.rotation.z = position2D.angle() - Math.PI * 0.5;
        } else {
            this.instance.rotation.y = position2D.angle() - Math.PI * 0.5;
        }
    }

    update() {

    }

    #initPosition() {

        // set new position
        if (this.stickOnWall) {
            const wall = this.#experience.world.wall;
            this.instance.position.z = wall!.instance.position.z + wall!.depth / 2 + this.size.z / 2;
        } else {
            const floor = this.#experience.world.floor;
            this.instance.position.y = floor!.instance.position.y + floor!.height / 2;
        }
    }
}