import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../../Experience";
import { Group, Material, type Mesh } from "three";

export default class PBRModel {
    #experience: Experience;
    material: Material | undefined;
    instance!: Mesh | Group;
    constructor(
        name: string,
        position = new THREE.Vector3(),
        rotation = new THREE.Vector3(),
    ) {
        this.#experience = new Experience();
        const model = this.#experience.resources.items[name];
        // set model
        if ((model as GLTF).scene) {
            this.setModel(model as GLTF, position, rotation);
        } else {
            throw new Error(`Model ${name} not found or is not a GLTF model.`);
        }
    }

    setModel(model: GLTF, position: THREE.Vector3, rotation: THREE.Vector3) {
        const modelClone = model.scene.clone();
        modelClone.userData["isDraggable"] = true;
        modelClone.name = modelClone.children[0].name.concat((Math.random() * 1000).toString());
        
        modelClone.position.copy(position);
        modelClone.rotation.set(rotation.x, rotation.y, rotation.z);

        this.instance = modelClone;
        this.#experience.scene.add(modelClone);

    }

    update() {
        // to override
    };
}