import * as THREE from 'three';
import Experience from "../Experience";

export default class Light {
    lightList: THREE.Light[];
    constructor() {
        // lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 0.25, 1);

        const pointLight = new THREE.PointLight("#ffffff", 4, 3);
        pointLight.position.y = 0.5;

        // add to list
        this.lightList = [ambientLight, directionalLight, pointLight ];
    }

    turnOn() {
        const experience = new Experience();
        this.lightList.forEach((light) => experience.scene.add(light));
    }
}