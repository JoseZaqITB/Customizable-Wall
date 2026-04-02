import { Mesh, Raycaster, Vector2 } from "three";
import Experience from "../Experience";
import type Sizes from "./Sizes";

type EvenstListenersNames = "objectClicked" | "pointerMove";

export default class Events {
    // properties
    #experience: Experience;
    #events: { [key: string]: { listenerName: string, event: (e: any) => void }[] } = {}

    pointerPos = new Vector2();

    constructor() {
        this.#experience = new Experience();

    }


    addEventListener = (name: EvenstListenersNames, callback?: (obj: Mesh | undefined) => void) => {
        switch (name) {
            case "objectClicked":
                this.#ObjectClickedListener(this.#experience.sizes, callback);
                break;
            case "pointerMove":
                this.#pointerMoveListener();
                break;
        }
    };
    removeEventListener = (name: EvenstListenersNames) => {
        switch (name) {
            case "objectClicked":
                this.#rmListener("objectClicked");
                break;
            case "pointerMove":
                this.#rmPointerMoveListener("pointerMove")
                break;
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

    #rmListener(name: EvenstListenersNames) {
        this.#events[name].forEach((event) =>
            this.#experience.canvas.removeEventListener(event.listenerName, event.event)
        )
    }

    #pointerMoveListener() {
        // OJO: add a condition: if it is already running just break fn
        this.#events["pointerMove"] = [];
        const event = this.#events["pointerMove"];
        // add listener
        const pointerMoveFn = (event: PointerEvent) => {
            this.pointerPos.x = (event.clientX / this.#experience.sizes.width) * 2 - 1
            this.pointerPos.y = - (event.clientY / this.#experience.sizes.height) * 2 + 1
        }
        // add event and listener
        document.addEventListener("pointermove", pointerMoveFn ); // on document because is for HUD
        event.push({listenerName: "pointermove", event: pointerMoveFn});
    }

    #rmPointerMoveListener(name: EvenstListenersNames) {
        this.#events[name].forEach((event) =>
            document.removeEventListener(event.listenerName, event.event)
        )
    }


}

