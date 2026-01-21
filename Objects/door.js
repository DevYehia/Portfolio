//el baab
import * as THREE from 'three'
import { Interactable } from './interactable';
import { commonTextures } from '../loader';
import { gsap } from 'gsap/gsap-core';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const DoorStates = {
    CLOSED: 0, 
    OPEN: 1,
    CLOSING: 2,
    OPENING: 3
}


export class Door extends Interactable{

    doorHeight = 10;
    doorWidth = 5;
    holeWidth = 3
    holeHeight = 3;
    holetopOffset = 1;
    openIntervalHandler = null;
    closeIntervalHandler = null;
    state = DoorStates.CLOSED;

    animationTime = 0.5
    numRotationsPerAnimation = 50;

    worldPos = new THREE.Vector3()
    sign = 1;


    constructor(isClockWiseOpen){

        super()

        this.controls = "Door<br>E - Open/Close"

        if(isClockWiseOpen){
            this.rotationSign = -1;
        }
        else{
            this.rotationSign = 1;
        }


        let geo = new THREE.BoxGeometry(this.doorWidth, this.doorHeight, 0.2);
        geo.translate(this.doorWidth / 2, this.doorHeight / 2, 0)
        let mat = new THREE.MeshStandardMaterial({color: 0xffffff, map: commonTextures["door"].texture})
        this.doorMesh = new THREE.Mesh(geo, mat);

        //add hitbox
        let hitBoxWidth = this.doorWidth;
        let hitBoxHeight = this.doorHeight;
        const hitBoxGeo = new THREE.BoxGeometry(hitBoxWidth, hitBoxHeight, 0);
        const hitBoxMat = new THREE.MeshBasicMaterial({visible: false});
        this.hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat); //will be an attribute, needed for collision detection

        //origin of object is bottom left so need to adjust hitbox position
        this.hitBox.position.x += this.doorWidth / 2;
        this.hitBox.position.y += this.doorHeight / 2;
        
        this.add(this.doorMesh, this.hitBox)

    }


    async open(){

        let originalRotationY = this.rotation.y;

        if(this.state == DoorStates.OPEN || this.state == DoorStates.OPENING || this.state == DoorStates.CLOSING){
            return;
        }
        this.state = DoorStates.OPENING

        let sleepDuration = this.animationTime / this.numRotationsPerAnimation
        gsap.to(this.rotation, 
            {
            y: Math.PI / 2 * this.rotationSign,
            onComplete: () => { this.state = DoorStates.OPEN},
            duration: this.animationTime,
            ease: "none"
            }
        )
    }

    async close(){
        if(this.state == DoorStates.CLOSED || this.state == DoorStates.OPENING || this.state == DoorStates.CLOSING){
            return;
        }
        this.state = DoorStates.CLOSING

        gsap.to(this.rotation, 
            {
            y: 0,
            onComplete: () => { this.state = DoorStates.CLOSED},
            duration: this.animationTime,
            ease: "none"
            }
        )
    }

    //this function will move the door according to its current state
    async toggle(){
        if(this.state == DoorStates.CLOSED){
            this.open();
        }
        else if (this.state == DoorStates.OPEN){
            this.close();
        }
    }

    isOpen(){
        return this.state == DoorStates.OPEN || this.state == DoorStates.OPENING;
    }

    getWorldPos(){
        this.doorMesh.getWorldPosition(this.worldPos);
        return this.worldPos
    }

}