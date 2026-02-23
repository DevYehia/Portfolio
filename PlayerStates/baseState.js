import * as THREE from 'three'

import { isSinglePress, keys, KeyStates } from '../Utils/keyboardUtils'
import { nextLine, endDialogue } from '../Utils/dialogUtils';
import { stateInstances } from './common';
import { changeState, directions } from './common';
import { CollisionHandler } from './collision';
import { InteractionManager } from './interactionManager';
import { player } from '../player';
import { optionsMoveLeft, optionsMoveRight, optionsMoveUp, optionsMoveDown, executeInteraction} from '../interactionUI';


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


    interactionManager = new InteractionManager()

    animatables = []

    stateBorders
    nextStates

    //for visited handling
    visited = false

    //callBacks for handling what happens upon visiting
    onFirstVisit = null
    onRepeatedVisit = null
    onExit = null;

    /**
     * @type {CollisionHandler}
     */

    collider

    constructor({stateName = "SomeName",
        onFirstVisit = null,
        onRepeatedVisit = null,
        onExit = null} = {}){
        this.stateName = stateName
        this.onFirstVisit = onFirstVisit
        this.onRepeatedVisit = onRepeatedVisit
        this.onExit = onExit
    }


    handleDialog(){
        if(player.inDialog && keys["q"] == KeyStates.SINGLE_PRESS){
            nextLine()
        }
        //end dialogue
        else if(player.inDialog && keys["x"] == KeyStates.SINGLE_PRESS){
            endDialogue()
        }        
    }

    handleInteractionMenu(){

        if(!player.inInteraction || player.inDialog)return

        if(isSinglePress("arrowRight") || isSinglePress("d")){
            optionsMoveRight()
        }
        else if(isSinglePress("arrowLeft") || isSinglePress("a")){
            optionsMoveLeft()
        }
        else if(isSinglePress("arrowUp") || isSinglePress("w")){
            optionsMoveUp()
        }
        else if(isSinglePress("arrowDown") || isSinglePress("s")){
            optionsMoveDown()
        }
        else if(isSinglePress("Enter")){
            executeInteraction()
        }
    }

/** 
*@param  {THREE.Vector3} playerPos
*@param  {THREE.Vector3} newPlayerPos

*/


    modifyPosition(playerPos, newPlayerPos){
        this.collider.modifyPosition(playerPos, newPlayerPos)
    }


    checkAndUpdateState(player){

        //console.log("Flag is what" + player.inInteraction)

        let playerPos = player.position

        this.handleDialog()
        this.handleInteractionMenu()
        this.animate()
    
        if(!player.inDialog)
            this.interactionManager.checkInteraction(player)


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