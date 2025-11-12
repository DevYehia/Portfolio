//el baab
import * as THREE from 'three'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const DoorStates = {
    CLOSED: 0, 
    OPEN: 1,
    CLOSING: 2,
    OPENING: 3
}

export class Door{

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

    constructor(){
        let shape = new THREE.Shape();
        shape.setFromPoints(
            [new THREE.Vector2(0,0),
            new THREE.Vector2(0,this.doorHeight),
            new THREE.Vector2(this.doorWidth,this.doorHeight),
            new THREE.Vector2(this.doorWidth,0)
            ]
        );

        let holeBottomOffset = this.doorHeight - this.holetopOffset -  this.holeHeight;
        let holeRightOffset = (this.doorWidth - this.holeWidth) / 2 //to be a centered hole
        const hole = new THREE.Path();
        hole.moveTo(holeRightOffset, holeBottomOffset);
        hole.lineTo(holeRightOffset, holeBottomOffset + this.holeHeight);
        hole.lineTo(holeRightOffset + this.holeWidth, holeBottomOffset + this.holeHeight);
        hole.lineTo(holeRightOffset + this.holeWidth, holeBottomOffset);
        hole.lineTo(holeRightOffset, holeBottomOffset);
        shape.holes.push(hole);


        let geo = new THREE.ExtrudeGeometry(shape);
        let mat = new THREE.MeshBasicMaterial({color: 0x0000ff})
        this.door = new THREE.Mesh(geo, mat);
        this.door.position.copy(new THREE.Vector3(0,0,0))
    }

    // open(){
    //     this.openIntervalHandler = setInterval(this.openHelper, 100)
    // }

    // close(){
    //     this.closeIntervalHandler = setInterval(this.closeHelper, 100)        
    // }

    async open(){
        if(this.state == DoorStates.OPEN || this.state == DoorStates.OPENING || this.state == DoorStates.CLOSING){
            return;
        }
        this.state = DoorStates.OPENING

        let sleepDuration = this.animationTime / this.numRotationsPerAnimation
        while(this.door.rotation.y < Math.PI/2){
            this.door.rotation.y += (Math.PI/2) / this.numRotationsPerAnimation
            await sleep(sleepDuration)
        }
        this.state = DoorStates.OPEN
        // else{
        //     clearInterval(this.openIntervalHandler)
        // }
    }

    async close(){
        if(this.state == DoorStates.CLOSED || this.state == DoorStates.OPENING || this.state == DoorStates.CLOSING){
            return;
        }
        this.state = DoorStates.CLOSING

        let sleepDuration = this.animationTime / this.numRotationsPerAnimation

        while(this.door.rotation.y > 0){
            this.door.rotation.y -= (Math.PI/2) / this.numRotationsPerAnimation
            await sleep(sleepDuration)
        }
        this.state = DoorStates.CLOSED
        // else{
        //     clearInterval(this.closeIntervalHandler)
        // }
    }

}