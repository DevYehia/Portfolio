import * as THREE from 'three';
import {PlayerData, collisionMargin, changeState} from './common';
import { LeftState } from './leftState'
import { getDistanceXZ } from '../Utils/MathUtils';
import { projectsData } from '../Data/projects';
import { animateText } from '../Utils/textUtils';
import { BaseState } from './baseState';
import { ProjectsRoom } from '../Rooms/projectsRoom';
import { keys, KeyStates } from '../Utils/keyboardUtils';
import { endDialogue, nextLine, startDialogue } from '../Utils/dialogUtils';
import { myRoom } from '../environment';

export class MyRoomState extends BaseState{





    lightInterval;

    constructor(){
        super()

        console.log("E7a hena")

        this.interactableList = [myRoom.door, ...myRoom.signsList, myRoom.skillsBoardGroup, myRoom.timeLineBoard]


    }


    incLight(){

        this.projectsRoom.roomLight.intensity += 1 / 1000;
       // console.log("Light is " + this.ambLight.intensity)
        if(this.projectsRoom.roomLight.intensity >= 1){
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

        // let fowardLimitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth - collisionMargin);
        // let backLimitZ = -(env.nearBoundaryCuboidDepth / 2 + collisionMargin);

        //x will be updated regardless
        playerPos.x = newPlayerPos.x;
        playerPos.z = newPlayerPos.z;
        return;

        //collision, don't modify
        if(newPlayerPos.z < fowardLimitZ || newPlayerPos.z > backLimitZ){
            return;
        }
        //no collision
        else{
            playerPos.z = newPlayerPos.z;
        }


    }
/** 
*@param  {PlayerData} playerData
*/       
    checkAndUpdateState(playerData){

        let playerPos = playerData.playerPos

        //animate  collectible particles
        // if(env.projectsRoom.certificate != null){
        //     env.projectsRoom.certificate.animate()
        // }

        this.handleDialog()

        if(!this.isInDialog)
            this.checkInteraction(playerPos, playerData.camera)





    }



}