import * as THREE from 'three'
import { getDistanceXZ } from '../Utils/MathUtils';
import { keys, KeyStates } from '../Utils/keyboardUtils'
import { nextLine, endDialogue } from '../Utils/dialogUtils';
import { stateInstances } from './states';
import { changeState } from './common';

export class StateBorders{

    forward
    backward
    left
    right
    constructor({
        forward = 0,
        backward = 0,
        left = 0,
        right = 0
    } = {}){
        this.forward = forward
        this.left = left
        this.right = right
        this.backward = backward
    }
}

export class StateNext{


    forward
    backward
    left
    right
    constructor({
        forward = null,
        backward = null,
        left = null,
        right = null
    } = {}){
        this.forward = forward
        this.left = left
        this.right = right
        this.backward = backward
    }
}




export class BaseState{

    //is the user in dialog (no shit)
    isInDialog = false;

    
    //for checking looking at
    camLookAt = new THREE.Vector3()

    rayCaster = new THREE.Raycaster()


    //each state will have one object to check for interactions
    interactable = null;

    interactableList = []

    animatables = []

    stateBorders
    nextStates
    collider

    constructor(stateName){
        this.stateName = stateName
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
            
                if(this.checkForTrigger(playerPos, camera, this.interactableList[i])){
                    console.log("ALooo ")
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

/** 
*@param  {THREE.Vector3} playerPos
*@param  {THREE.Vector3} newPlayerPos

*/


    modifyPosition(playerPos, newPlayerPos){
        if(!this.collider.collides(newPlayerPos)){
            playerPos.copy(newPlayerPos)
        }
    }

    /** 
    *@param  {PlayerData} playerData
    */       
    checkAndUpdateState(playerData){
        let playerPos = playerData.playerPos;


        this.handleDialog()
        this.animate()
    
        if(!this.isInDialog)
            this.checkInteraction(playerPos, playerData.camera)


        if(this.nextStates.forward != null && playerPos.z < this.stateBorders.forward){
            changeState(stateInstances[this.nextStates.forward]);
        }
        else if(this.nextStates.backward != null && playerPos.z > this.stateBorders.backward){
            changeState(stateInstances[this.nextStates.backward]);
        }
        else if(this.nextStates.left != null && playerPos.x < this.stateBorders.left){
            changeState(stateInstances[this.nextStates.left]);
        }
        else if(this.nextStates.right != null && playerPos.x > this.stateBorders.right){
            changeState(stateInstances[this.nextStates.right]);
        }
    }

    animate(){
        this.animatables.forEach((itm) => itm?.animate())
    }

}