import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { ForkRoadState } from './forkRoadState';
import { BaseState } from './baseState';
import { keys, KeyStates } from '../Utils/keyboardUtils';
import { getDistanceXZ } from '../Utils/MathUtils';
import { HOFState } from './HOFState';

export class RightState extends BaseState{


    //the door to the HOF Room
    door;

    doorTriggerDistance = 10;


    constructor(){
        super();
        this.door = env.hallOfFameRoom.door
        this.interactableList = [this.door]
    }
/** 
*@param  {THREE.Vector3} playerPos
*@param  {THREE.Vector3} newPlayerPos
*/        
    modifyPosition(playerPos, newPlayerPos){
        let fowardLimitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth - collisionMargin);
        let backLimitZ = -(env.nearBoundaryCuboidDepth / 2 + collisionMargin);

        let forwardLimitX = env.boundaryCuboidWidth + env.pathWidth / 2 - collisionMargin

        let doorWorldPos = this.door.getWorldPos();
        let doorLeftZ = doorWorldPos.z;
        let doorRightZ = doorWorldPos.z + this.door.doorWidth;

        console.log("Door leftz and door right z are " + doorLeftZ + " " + doorRightZ + " " + playerPos.z)
        

        //x will be updated regardless
        if((newPlayerPos.x <= forwardLimitX) || 
            (this.door.isOpen() && 
            newPlayerPos.z > doorLeftZ && 
            newPlayerPos.z < doorRightZ)){
                playerPos.x = newPlayerPos.x;
            }

        //unstuck player
        if(playerPos.x > forwardLimitX && !this.door.isOpen()){
            playerPos.x = forwardLimitX - 1
        }


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

        this.handleDialog()

        if(!this.isInDialog)
            this.checkInteraction(playerPos, playerData.camera)


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