import * as THREE from 'three';
import Experience from '../Experience.js'
import type Resources from '../Utils/Resources.js';
import Wall from './Object/Wall.js';
import Floor from './Object/Floor.ts';

export default class World {
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
           
        })

        // objects
         const wall = new Wall();
         const floor = new Floor();
    }

    update() {
        /* if(this.fox)
            this.fox.update() */
    }
}