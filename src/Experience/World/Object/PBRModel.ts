import type { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../../Experience";
import { Material, MeshStandardMaterial, Texture, type Mesh } from "three";

export default class PBRModel {
    #experience: Experience;
    material: Material;
    instance!: Mesh;
    constructor(name: string, diff?: string, arm?: string, normal?: string) {
        this.#experience = new Experience();
        const model = this.#experience.resources.items[name];
        
        // set PBR textures if provided
        const resources = this.#experience.resources.items;
        const material = new MeshStandardMaterial({
            map: diff ? resources[diff] as Texture : undefined,
            aoMap: arm ? resources[arm] as Texture : undefined,
            roughnessMap: arm ? resources[arm] as Texture : undefined,
            metalnessMap: arm ? resources[arm] as Texture : undefined,
            normalMap: normal ? resources[normal] as Texture : undefined,
        });
        this.material = material;
        // set model
        if ((model as GLTF).scene) {
            this.setModel(model as GLTF);
        } else {
            throw new Error(`Model ${name} not found or is not a GLTF model.`);
        }
    }

    setModel(model: GLTF) {
        const mesh = model.scene.children[0].clone() as Mesh;
        mesh.name = mesh.name.concat((Math.random() * 1000).toString());
        if (mesh.isMesh)
            mesh.material = this.material;
        mesh.position.set(0,0, 2); // could be seted by the floor depth
        // set instance and add to scene
        this.instance = mesh;
        this.#experience.scene.add(mesh);
    }

    update() {
        // to override
    };
}