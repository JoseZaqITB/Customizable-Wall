import * as THREE from "three";
import Object3D from "./Object3D";

export default class Floor extends Object3D {
    color: number;
    width: number;
    height: number;
    depth: number;
    constructor(y = 0,width = 10, depth = 5, height = 0.25, color = 0xe8dfb0) {
        const geometry = new THREE.BoxGeometry(width, depth, height);
        const material = new THREE.MeshBasicMaterial({ color });

        // setup matrix
        geometry.rotateX(-Math.PI / 2);
        //
        super(geometry, material);
        
        // init properties
        this.color = color;
        this.width = width;
        this.height = height;
        this.depth = depth;

        this.#initPosition(y);
    }

    #initPosition(y = 0) {
        this.instance.position.set(0, y-this.height / 2, 0 );
    }
}