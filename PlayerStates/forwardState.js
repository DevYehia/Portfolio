import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';

import { ForkRoadState } from './forkRoadState';
import { BaseState } from './baseState';
import { myRoom } from '../environment';

export class ForwardState extends BaseState{

/** 
*@param  {THREE.Vector3} playerPos
*@param  {THREE.Vector3} newPlayerPos
*/        
    modifyPosition(playerPos, newPlayerPos){
        let limitX = env.pathWidth / 2 - collisionMargin;

        //z will be updated regardless
        playerPos.z = newPlayerPos.z;

        //collision, don't modify
        if(newPlayerPos.x > limitX || newPlayerPos.x < -limitX){
            return;
        }
        //no collision
        else{
            playerPos.x = newPlayerPos.x;
        }


    }
/** 
*@param  {PlayerData} playerData
*/       
    checkAndUpdateState(playerData){

        myRoom.getNextSkill()
        let playerPos = playerData.playerPos;
        //if player goes back
        let limitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth);

        if(playerPos.z > limitZ){
            changeState(new ForkRoadState());
        }
    }


}