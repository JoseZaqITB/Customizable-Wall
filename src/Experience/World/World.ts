import * as THREE from 'three';
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import type Resources from '../Utils/Resources.js';

export default class World
{
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            /* this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment() */
        })
    }

    update()
    {
        /* if(this.fox)
            this.fox.update() */
    }
}