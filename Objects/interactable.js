import * as THREE from 'three'
import { KeyStates } from '../Utils/keyboardUtils'

export class Interactable extends THREE.Object3D{

    controlsDiv =  document.getElementById("controlsDiv")

    controls = "mlo"


    triggerDistance = 13

    interactions = {}


    constructor(){
        super()
    }

    trigger(){
        this.controlsDiv.hidden = false
        this.controlsDiv.innerHTML = this.controls

    }

    revert(){
        this.controlsDiv.hidden = true
    }

    updateDivContent(){
        this.controlsDiv.innerHTML = this.controls        
    }

    interact(key){
        console.log("in key " + key)
        this.interactions[key]?.()

    }
}