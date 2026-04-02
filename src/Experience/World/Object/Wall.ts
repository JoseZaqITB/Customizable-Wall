import * as THREE from "three";
import Object3D from "./Object3D";

export default class Wall extends Object3D {
    color: number;
    width: number;
    height: number;
    depth: number;
    constructor(width: number = 10, height: number = 5, depth: number = 0.25, color: number = 0xEDE8D0) {
        const geometry = new THREE.BoxGeometry(width,height,depth);
        const material = new THREE.MeshBasicMaterial({ color });
        // setup geometry
        geometry.translate(0, 0, depth / 2);
        //
        super(geometry, material);
        
        // init properties
        this.color = color;
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    setZ(z: number) {
        this.instance.position.z = z;
    }
}