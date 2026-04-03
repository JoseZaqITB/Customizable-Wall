import type { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../../Experience";
import { Group, Material, MeshStandardMaterial, Texture, type Mesh } from "three";

export default class PBRModel {
    #experience: Experience;
    material: Material | undefined;
    instance!: Mesh | Group;
    constructor(name: string, diff?: string, arm?: string, normal?: string) {
        this.#experience = new Experience();
        const model = this.#experience.resources.items[name];

        // set PBR textures if provided
        const resources = this.#experience.resources.items;
        if (diff && arm && normal) {
            const material = new MeshStandardMaterial({
                map: resources[diff] as Texture,
                aoMap: resources[arm] as Texture,
                roughnessMap: resources[arm] as Texture,
                metalnessMap: resources[arm] as Texture,
                normalMap: resources[normal] as Texture,
            });
            this.material = material;
        }
        // set model
        if ((model as GLTF).scene) {
            this.setModel(model as GLTF);
        } else {
            throw new Error(`Model ${name} not found or is not a GLTF model.`);
        }
    }

    setModel(model: GLTF) {
        const mesh = model.scene.children[0].clone() as Mesh;
        if (model.scene.children.length > 0 && mesh.isMesh && this.material) {
            mesh.name = mesh.name.concat((Math.random() * 1000).toString());
            mesh.userData["isDraggable"] = true;
            mesh.material = this.material;
            this.instance = mesh;
            this.#experience.scene.add(mesh);
        } else {
            const modelClone = model.scene.clone();
            modelClone.userData["isDraggable"] = true;
            modelClone.name = modelClone.name.concat((Math.random() * 1000).toString());
            this.instance = modelClone;
            this.#experience.scene.add(modelClone);
        }
        // set instance and add to scene

    }

    update() {
        // to override
    };
}