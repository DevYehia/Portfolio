import * as THREE from 'three'
import { getDistanceXZ } from '../Utils/MathUtils';
import { keys, KeyStates } from '../Utils/keyboardUtils'
import { nextLine, endDialogue } from '../Utils/dialogUtils';


export class BaseState{

    //is the user in dialog (no shit)
    isInDialog = false;

    
    //for checking looking at
    camLookAt = new THREE.Vector3()

    rayCaster = new THREE.Raycaster()


    //each state will have one object to check for interactions
    interactable = null;

    interactableList = []

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
                if(this.checkForTrigger(playerPos, camera, this.interactableList[i])){
                    this.interactable = this.interactableList[i];
                    this.interactable.trigger()
                    break;
                }
            }
        }

    }

    handleDialog(){
        if(this.isInDialog && keys["q"] == KeyStates.SINGLE_PRESS){
            let areThereMoreLines = nextLine()
            this.isInDialog = areThereMoreLines;
        }
        //end dialogue
        else if(this.isInDialog && keys["x"] == KeyStates.SINGLE_PRESS){
            endDialogue()
            this.isInDialog = false;
        }        
    }



}