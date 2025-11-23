import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { ForkRoadState } from './forkRoadState';
import { BaseState } from './baseState';

export class RightState extends BaseState{

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
        console.log("in right state and x is " + playerData.playerPos.x);
        let playerPos = playerData.playerPos;
        //if player goes back
        let backLimitX =  (env.pathWidth / 2);

        if(playerPos.x < backLimitX){
            changeState(new ForkRoadState());
        }
    }


}