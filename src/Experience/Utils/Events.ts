import { Mesh, Raycaster, Vector2 } from "three";
import Experience from "../Experience";
import type Sizes from "./Sizes";

type EvenstListenersNames = "objectClicked";

export default class Events {
    // properties
    #experience: Experience;
    #events: { [key: string]: { listenerName: string, event: (e: any) => void }[] } = {}

    constructor() {
        this.#experience = new Experience();

    }


    addEventListener = (name: EvenstListenersNames, callback?: (obj: Mesh | undefined) => void) => {
        switch (name) {
            case "objectClicked":
                this.#ObjectClickedListener(this.#experience.sizes, callback);
        }
    };
    removeEventListener = (name: EvenstListenersNames) => {
        switch (name) {
            case "objectClicked":
                this.#rmObjectClickedListener();
        }
    };

    #ObjectClickedListener(sizes: Sizes, callback?: (obj: Mesh | undefined) => void) {
        this.#events["objectClicked"] = [];
        const event = this.#events["objectClicked"];
        const mouse = new Vector2(0, 0);
        /* RAYCASTER */
        const raycaster = new Raycaster();
        /* TOUCH OR CLICKED LISTENER */
        const pointerClickEvent = (event: PointerEvent) => {
            // mouse position
            mouse.x = event.clientX / sizes.width * 2 - 1
            mouse.y = - (event.clientY / sizes.height) * 2 + 1
            // ray setup
            raycaster.setFromCamera(mouse, this.#experience.camera.instance);
            // get objects
            const intersectedObjs = raycaster.intersectObjects(this.#experience.world.meshList);
            if (callback) {
                if (intersectedObjs.length > 0) {
                    callback(intersectedObjs[0].object as Mesh);
                }
                else
                    callback(undefined);
            }

        }

        this.#experience.canvas.addEventListener("pointerup", pointerClickEvent);
        event.push({ listenerName: "pointerup", event: pointerClickEvent });

    }

    #rmObjectClickedListener() {
        this.#events["objectClicked"].forEach((event) =>
            this.#experience.canvas.removeEventListener(event.listenerName, event.event)
        )
    }

}

