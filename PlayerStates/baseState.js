import * as THREE from 'three'

import { keys, KeyStates } from '../Utils/keyboardUtils'
import { nextLine, endDialogue } from '../Utils/dialogUtils';
import { stateInstances } from './states';
import { changeState, directions } from './common';
import { player } from '../run';
import { CollisionHandler } from './collision';
import { InteractionManager } from './interactionManager';

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

    interactionManager = new InteractionManager()

    animatables = []

    stateBorders
    nextStates

    visited = false

    /**
     * @type {CollisionHandler}
     */

    collider

    constructor(stateName, visitedAction, notVisitedAction){
        this.stateName = stateName

        if(this.visited){
            visitedAction?.();
        }
        else{
            this.visited = false;
            notVisitedAction?.();
        }

        //adjust player light
 
        

    }



    checkInteraction(playerPos, camera){

        this.interactionManager.checkInteraction(playerPos, camera)

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
        this.collider.modifyPosition(playerPos, newPlayerPos)
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


        //check next state
        for(let dirName in directions){
            let axisSign = directions[dirName].charAt(0)
            let axis = directions[dirName].charAt(1)

            let cond = ((axisSign == '+') ? playerPos[axis] > this.stateBorders[dirName] : playerPos[axis] < this.stateBorders[dirName])

            if(this.nextStates[dirName] && cond)changeState(stateInstances[this.nextStates[dirName]])
        }

    }

    animate(){
        this.animatables.forEach((itm) => itm?.animate())
    }

}