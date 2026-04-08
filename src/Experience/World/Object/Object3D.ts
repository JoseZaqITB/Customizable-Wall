import * as THREE from "three";
import Experience from "../../Experience";

export default class Object3D {
    experience: Experience;
    instance: THREE.Mesh;
    
    constructor(geometry: THREE.BufferGeometry, material: THREE.Material ) {

        // create mesh
        this.instance = new THREE.Mesh(geometry, material);

        // add to scene
        this.experience = new Experience();
        this.experience.scene.add(this.instance);

    }

    // methods
    dispose() {
        // dispose stuff
        this.instance.geometry.dispose();
        if( this.instance.material instanceof THREE.Material)
            this.instance.material.dispose();
        else {
            this.instance.material.forEach((material) => material.dispose())
        }
        // remove mesh from scene
        this.experience.scene.remove(this.instance);
    }

    update() {}
    tick() {}

}