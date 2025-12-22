import * as THREE from 'three'
import { BaseState } from "./baseState";
import { hallOfFameRoom, projectsRoom } from '../environment';
import { keys, KeyStates } from '../Utils/keyboardUtils';
import { getDistanceXZ } from '../Utils/MathUtils';
import * as env from '../environment'
import { RightState } from './rightState';
import { changeState } from './common';

export class HOFState extends BaseState{
   //for checking collision with door

    doorTriggerDistance = 10

    boardTriggerDist = 20;

    /**
     * @type {Image}
     */
    currImage = null

    lightInterval;

    constructor(){
        super()

        this.interactableList = [hallOfFameRoom.door, ...hallOfFameRoom.board.imageList]
        //this.lightInterval = setInterval(this.incLight.bind(this), 1 / 1000);
    }


    incLight(){

        hallOfFameRoom.ambLight.intensity += 1 / 1000;
       // console.log("Light is " + this.ambLight.intensity)
        if(hallOfFameRoom.ambLight.intensity >= 1){
            clearInterval(this.lightInterval)
        }
    }

/** 
*@param  {THREE.Vector3} playerPos
*@param  {THREE.Vector3} newPlayerPos

*/

    modifyPosition(playerPos, newPlayerPos){

        //if in dialog, respct the dialog
        if(this.isInDialog){
            return;
        }

        //do nothing till now
        playerPos.copy(newPlayerPos)

        // //
        // let fowardLimitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth - collisionMargin);
        // let backLimitZ = -(env.nearBoundaryCuboidDepth / 2 + collisionMargin);

        // //x will be updated regardless
        // playerPos.x = newPlayerPos.x;

        // //collision, don't modify
        // if(newPlayerPos.z < fowardLimitZ || newPlayerPos.z > backLimitZ){
        //     return;
        // }
        // //no collision
        // else{
        //     playerPos.z = newPlayerPos.z;
        // }


    }
/** 
*@param  {PlayerData} playerData
*/       
    checkAndUpdateState(playerData){

        console.log("Light is " + JSON.stringify(projectsRoom.ambLight))

        let playerPos = playerData.playerPos;
        let camera = playerData.camera

        this.handleDialog()

        if(!this.isInDialog)
            this.checkInteraction(playerPos, playerData.camera)

        //handle state change

        //if player goes back
        let backLimitX = env.pathWidth / 2 + env.boundaryCuboidWidth;

        if(playerPos.x < backLimitX){
            changeState(new RightState());
        }

    }


    handleInput(usedKeys){
        let controlsDiv = document.getElementById("controlsDiv");
        if(!this.isInDialog && usedKeys["p"] == KeyStates.SINGLE_PRESS){
            window.open(this.currImage.profile)
        }

    }    
}