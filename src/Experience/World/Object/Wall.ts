import * as THREE from "three";
import StaticObject from "./StaticObject";
import Experience from "../../Experience";

export default class Wall extends StaticObject {
    width: number;
    height: number;
    depth: number;
    constructor(width: number = 10, height: number = 5, depth: number = 0.25, color = "#dd5a03") {
        const experience = new Experience();
        const geometry = new THREE.BoxGeometry(width, height, depth);
        // set material
        const diffTxt = experience.resources.items["wall_diff"] as THREE.Texture;
        const armTxt = experience.resources.items["wall_arm"] as THREE.Texture;
        const norTxt = experience.resources.items["wall_nor"] as THREE.Texture;
        // setup txt
        diffTxt.colorSpace = THREE.SRGBColorSpace;
        diffTxt.offset.set(Math.random(), Math.random());        

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
        //
        super(geometry, material);

        // init properties
        this.color = color;
        this.width = width;
        this.height = height;
        this.depth = depth;

    }


    setZ(z: number) {
        this.instance.position.z = z + this.depth / 2;
    }

}