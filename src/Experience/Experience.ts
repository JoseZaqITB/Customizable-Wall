import * as THREE from 'three'

import Debug from './Utils/Debug.ts'
import Sizes from './Utils/Sizes.ts'
import Time from './Utils/Time.ts'
import Camera from './Camera.ts'
import Renderer from './Renderer.ts'
import World from './World/World.ts'
import Resources from './Utils/Resources.ts'

import sources from './sources.ts'
import Events from './Utils/Events.ts'
import HUD from '../UI/HUD.ts'

let instance: Experience | null = null;

export default class Experience {
    canvas!: HTMLCanvasElement;
    debug!: Debug;
    sizes!: Sizes;
    time!: Time;
    scene!: THREE.Scene;
    resources!: Resources;
    camera!: Camera;
    renderer!: Renderer;
    world!: World;
    events!: Events;
    hud!: HUD;

    constructor(_canvas?: HTMLCanvasElement) {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        // no canvas
        if (!_canvas) 
            throw new Error('No canvas provided!');
        // Options
        this.canvas = _canvas;

        
    }

    start() {
        // Setup
        this.events = new Events();
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.hud = new HUD();
        this.debug = new Debug()

        

        // Global access ( optional )
        //window.experience = this

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
        this.hud.update();
    }

    destroy() {
        this.events.removeEventListener("objectClicked");
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active)
            this.debug.ui!.destroy()
    }
}