import * as THREE from 'three'
import { getDistanceXZ } from '../Utils/MathUtils';
import { keys, KeyStates } from '../Utils/keyboardUtils'

export class InteractionManager{

    camLookAt = new THREE.Vector3()
    
    rayCaster = new THREE.Raycaster()

    interactable = null;

    interactableList = []

    constructor(){

    }

    /**
     * 
     * @param {Number} dist 
     * @param {THREE.Camera} camera 
     * @param {THREE.Object3D} object 
     */

    
    checkForTrigger(playerPos, camera, object){

        let dist = getDistanceXZ(playerPos, object.hitBox)
        let triggerDistance = object.triggerDistance;


        camera.getWorldDirection(this.camLookAt);
        this.rayCaster.set(camera.position, this.camLookAt);

        //console.log("Awl cond " + (dist <= triggerDistance) + " Tany Cond " + (this.rayCaster.intersectObject(object.hitBox, false).length > 0))
        

        return (dist <= triggerDistance && this.rayCaster.intersectObject(object.hitBox, false).length > 0)

    }

    checkInteraction(playerPos, camera){

        if(this.isInDialog)return
        
        //check current interactable
        if(this.interactable != null){
            
            //not triggered
            if(!this.checkForTrigger(playerPos, camera, this.interactable)){
                this.interactable.revert()
                this.interactable = null;
            }
            else{
                //interaction handling
                for(let key in keys){
                    if(keys[key] == KeyStates.SINGLE_PRESS)
                        this.interactable?.interact(key)
                }

            }
        }

        //no current interactable
        else{
            for(let i in this.interactableList){

                //skip null
                if(this.interactableList[i] == null)continue
            
                if(this.checkForTrigger(playerPos, camera, this.interactableList[i])){
                    console.log("ALooo ")
                    this.interactable = this.interactableList[i];
                    this.interactable.trigger()
                    break;
                }
            }
        }

    }

}