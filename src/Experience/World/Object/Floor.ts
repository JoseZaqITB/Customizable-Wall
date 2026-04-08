import * as THREE from "three";
import StaticObject from "./StaticObject";
import Experience from "../../Experience";

export default class Floor extends StaticObject {
    width: number;
    height: number;
    depth: number;
    constructor(y = 0, width = 10, depth = 5, height = 0.25, color = 0xe8dfb0) {
        const geometry = new THREE.BoxGeometry(width, depth, height);
        // set material
        const experience = new Experience();
        const diffTxt = experience.resources.items["floor_diff"] as THREE.Texture;
        const armTxt = experience.resources.items["floor_arm"] as THREE.Texture;
        const norTxt = experience.resources.items["floor_nor"] as THREE.Texture;

        // setup txts
        diffTxt.colorSpace = THREE.SRGBColorSpace;
        
        [diffTxt, armTxt, norTxt].forEach(tex => {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(2, 1);
        });
        
        const material = new THREE.MeshStandardMaterial({
            map: diffTxt,
            aoMap: armTxt,
            roughnessMap: armTxt,
            metalnessMap: armTxt,
            normalMap: norTxt,
        });

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
        this.instance.position.set(0, y - this.height / 2, 0);
    }
}