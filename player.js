import * as THREE from 'three'

class Player extends THREE.Object3D{

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    light =  new THREE.PointLight(0xffffff, 1, 1, 0)
    inDialog = false
    inInteraction = false
    hasTriggeredFinalPart = false

    constructor(){
        super()
        this.add(this.camera, this.light)
    }

}

export const player = new Player()
