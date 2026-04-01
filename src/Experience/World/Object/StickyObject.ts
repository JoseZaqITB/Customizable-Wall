import Object3D from "./Object3D";
import PBRModel from "./PBRModel";

export default class StickyObject extends PBRModel {
    stickY: boolean;
     constructor(name: string, diff?: string, arm?: string, normal?: string, stickY: boolean = true) {
        super(name, diff, arm, normal);
        // set properties
        this.stickY = stickY;
    }

    move(){
        if(this.stickY)
        {
            this.instance.position.y += 0.001;
        }
    }

    update() {
        this.move();
    }
}