import * as THREE from 'three';
import Experience from "../Experience";

export default class Light {
    constructor() {
        const experience = new Experience();
        // lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        experience.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 0.25, 1);
        experience.scene.add(directionalLight);

        const pointLight = new THREE.PointLight("#ffffff", 4, 3);
        pointLight.position.y = 0.5;
        experience.scene.add(pointLight);
    }
}