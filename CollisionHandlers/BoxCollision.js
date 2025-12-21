import { Vector3 } from "three/webgpu";



//Base for all collisions
//only detects collisions on x and z not y
export class BoxCollision{

    constructor(leftX, rightX, backZ, frontZ){
        this.leftX = leftX
        this.rightX = rightX
        this.backZ = backZ
        this.frontZ = frontZ;
    }


    doesCollide(playerPos){
        return (playerPos.z > this.backZ || playerPos.z < this.frontZ || playerPos.x > this.rightX || playerPos.x < this.leftX)
    }
}