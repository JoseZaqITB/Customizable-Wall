import * as THREE from 'three';
import Experience from "../Experience";

export default class Light {
    constructor() {
        const experience = new Experience();
        // lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        experience.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 0);
        experience.scene.add(directionalLight);
    }
}