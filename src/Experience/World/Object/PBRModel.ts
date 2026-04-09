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
        const modelClone = cloneObjectUnique(model.scene);
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

    dispose() {
        /* dispose only cloned stuff */
        this.#experience.scene.remove(this.instance);
        freeObjectMemory(this.instance);
    }
}

function freeObjectMemory(obj: THREE.Mesh | THREE.Group ) {
    if (obj instanceof Group) {
        deleteTraverseAll(obj);
    } else if (obj instanceof THREE.Mesh) {
        // obj material
        if (Array.isArray(obj.material))
            obj.material.map((m) => m.dispose());
        else
            obj.material.dispose();
    }
}

function cloneObjectUnique(obj: THREE.Mesh | THREE.Group) {
    // si es grupo
    let clone = obj.clone(true); // true: clone all descedants too
    if (clone instanceof Group) {
        traverseAll(clone);
    } else if (clone instanceof THREE.Mesh) {
        // clone material
        if (Array.isArray(clone.material))
            clone.material = clone.material.map((m) => m.clone());
        else
            clone.material = clone.material.clone();
    }
    return clone;
}

function traverseAll(object: THREE.Mesh | THREE.Group) {
    object.traverse((subobj) => {
        if (subobj instanceof THREE.Group && subobj !== object){
            traverseAll(subobj);
        }else if (subobj instanceof THREE.Mesh) {
            // clone material
            if (Array.isArray(subobj.material))
                subobj.material = subobj.material.map((m) => m.clone());
            else
                subobj.material = subobj.material.clone();
        }
    })
}


function deleteTraverseAll(object: THREE.Mesh | THREE.Group) {
    object.traverse((subobj) => {
        if (subobj instanceof THREE.Group && subobj !== object){
            traverseAll(subobj);
        }else if (subobj instanceof THREE.Mesh) {
            // clone material
            if (Array.isArray(subobj.material))
                subobj.material.map((m) => m.dispose());
            else
                subobj.material.dispose();
        }
    })
}