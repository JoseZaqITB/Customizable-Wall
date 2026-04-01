import * as THREE from "three";
import Object3D from "./Object3D";

export default class Floor extends Object3D {
    color: number;
    constructor(width = 10, depth = 5, height = 0.25, color = 0xe8dfb0) {
        const geometry = new THREE.BoxGeometry(width, depth, height);
        const material = new THREE.MeshBasicMaterial({ color });

        // setup geomretry
        geometry.translate(0, -depth/2, -height / 2);
        geometry.rotateX(-Math.PI / 2);
        //
        super(geometry, material);

        // init properties
        this.color = color;
    }
}