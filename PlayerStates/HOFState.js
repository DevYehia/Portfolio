import * as THREE from 'three'
import { BaseState } from "./baseState";
import { hallOfFameRoom, projectsRoom } from '../environment';
import { keys, KeyStates } from '../Utils/keyboardUtils';
import { getDistanceXZ } from '../Utils/MathUtils';
import { Image } from '../Objects/image';
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

        let controlsDiv = document.getElementById("controlsDiv");

        let doorDist = getDistanceXZ(playerPos, hallOfFameRoom.door.doorMesh)

        //check for door collision
        //see the door and be at good distance
        if (this.checkForTrigger(doorDist, this.doorTriggerDistance, camera, hallOfFameRoom.door.hitBox)){
            controlsDiv.innerHTML = "Door<br>E - Open/Close";
            controlsDiv.hidden = false;

            //now check for keyboard input
            if(keys["e"] == KeyStates.SINGLE_PRESS || keys["e"] == KeyStates.LONG_PRESS){
                hallOfFameRoom.door.trigger();
            }
            return //don't continue to image checking , no need

        }
        else{
            //controlsDiv.hidden = true;
        }        

        //according to player look at and position find image
    
        //check if still looking at curr image
        let boardPlayerDist = Math.abs(playerPos.x - hallOfFameRoom.board.getPosition().x)
        if(this.currImage != null){
            if(!this.checkForTrigger(boardPlayerDist, this.boardTriggerDist, camera, this.currImage.hitBoxMesh)){
                this.currImage = null;
                controlsDiv.hidden = true;
            }
            else{ //still triggering sign, handle interactions
                this.handleInput(keys)
            }
        }

        else{
            let foundImage = false;
            let imageList = hallOfFameRoom.board.imageList
            for(let i = 0 ; i < imageList.length ; i++){
                let currImage = imageList[i]

                if(this.checkForTrigger(boardPlayerDist, this.boardTriggerDist, camera, currImage.hitBoxMesh)){

                    this.currImage = currImage

                    controlsDiv.innerHTML = currImage.friendName + "<br>P - Show Profile";
                    controlsDiv.hidden = false;

                    foundImage = true;

                    break; //found a sign,end loop

                }
            }

            if(!foundImage){
                controlsDiv.hidden = true; //didn't trigger any door or sign
            }
        }


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