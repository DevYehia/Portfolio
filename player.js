import * as THREE from 'three'

class Player extends THREE.Object3D{

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    light =  new THREE.PointLight(0xffffff, 1, 1, 0)
    hasStarted = false //To display starting dialog after first click
    inDialog = false
    inInteraction = false
    inWaitingForName = false; //when asking for users name
    hasTriggeredFinalPart = false

    constructor(){
        super()
        this.add(this.camera, this.light)
    }

    canMove(){
        return !(this.inDialog || this.inInteraction || this.inWaitingForName)
    }

}

export const player = new Player()
