import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { ForkRoadState } from './forkRoadState';
import { BaseState } from './baseState';
import { keys, KeyStates } from '../keyboardUtils';
import { getDistanceXZ } from '../MathUtils';
import { HOFState } from './HOFState';

export class RightState extends BaseState{


    //the door to the HOF Room
    door;

    doorTriggerDistance = 10;


    constructor(){
        super();
        this.door = env.hallOfFameRoom.door
    }
/** 
*@param  {THREE.Vector3} playerPos
*@param  {THREE.Vector3} newPlayerPos
*/        
    modifyPosition(playerPos, newPlayerPos){
        let fowardLimitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth - collisionMargin);
        let backLimitZ = -(env.nearBoundaryCuboidDepth / 2 + collisionMargin);

        //x will be updated regardless
        playerPos.x = newPlayerPos.x;

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
        let playerPos = playerData.playerPos;

        //get lookAt
        playerData.camera.getWorldDirection(this.camLookAt);
        
        this.rayCaster.set(playerPos, this.camLookAt);

        let dist = getDistanceXZ(playerPos, this.door.doorMesh)

        let controlsDiv = document.getElementById("controlsDiv");

        //see the door and be at good distance
        if (this.rayCaster.intersectObject(this.door.doorMesh, false).length > 0 && dist <= this.doorTriggerDistance){
            controlsDiv.innerHTML = "Door<br>E - Open/Close";
            controlsDiv.hidden = false;

            //now check for keyboard input
            if(keys["e"] == KeyStates.SINGLE_PRESS || keys["e"] == KeyStates.LONG_PRESS){
                this.door.trigger();
            }

        }
        else{
            controlsDiv.hidden = true;
        }


        //if player goes back
        let backLimitX =  (env.pathWidth / 2);
        let forwardLimitX = backLimitX + env.boundaryCuboidWidth

        if(playerPos.x < backLimitX){
            changeState(new ForkRoadState());
        }
        else if(playerPos.x > forwardLimitX){
            changeState(new HOFState())
        }
    }


}