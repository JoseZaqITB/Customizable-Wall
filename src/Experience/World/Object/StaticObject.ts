import * as THREE from "three";
import Experience from "../../Experience";

export default class StaticObject {
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

    get color(): string {
        const material = this.instance.material;
        if(material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
            return `#${material.color.getHexString()}`;
        } else {
            throw new Error("the Material has no color parameter");
        }
    }

    set color(color: THREE.ColorRepresentation) {
        // set to object
        const material = this.instance.material;
        if(material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
            material.color = new THREE.Color(color);
        } else {
            throw new Error("the Material has no color parameter");
        }
        
    }

    update() {}
    tick() {}

}