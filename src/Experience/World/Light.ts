import * as THREE from 'three';
import Experience from "../Experience";

export default class Light {
    constructor() {
        const experience = new Experience();
        // lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
        experience.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 1);
        experience.scene.add(directionalLight);
    }
}