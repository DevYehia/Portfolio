import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { LeftState } from './leftState'
import { StartState } from './startState';
import { RightState } from './rightState';
import { ForwardState } from './forwardState'
import { BaseState } from './baseState';



export class ForkRoadState extends BaseState{

    forwardLimitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth);
    backwardLimitZ = -(env.nearBoundaryCuboidDepth / 2);
    leftLimitX = -(env.pathWidth / 2);
    rightLimitX = env.pathWidth / 2;

    constructor(){
        //Here will be the logic to shift camera up
        super();
    }


/** 
*@param  {THREE.Vector3} playerPos
*@param  {THREE.Vector3} newPlayerPos
*/        
    modifyPosition(playerPos, newPlayerPos){

        const forwardLimitZWithMargin = this.forwardLimitZ + collisionMargin;
        const backwardLimitZWithMargin = this.backwardLimitZ - collisionMargin;
        const leftLimitXWithMargin = this.leftLimitX + collisionMargin;
        const rightLimitXWithMargin = this.rightLimitX - collisionMargin;

        //there is a restiction if player goes diagonally
        //restriction happens if both x and z exceed limit

        // console.log("f limit is " + forwardLimitZ + " back limit is " + backwardLimitZ)

        // let cond1 = (newPlayerPos.x < leftLimitX && newPlayerPos.z > backwardLimitZ);
        // let cond2 = (newPlayerPos.x > rightLimitX && newPlayerPos.z > backwardLimitZ);
        // let cond3 = (newPlayerPos.x < leftLimitX && newPlayerPos.z < forwardLimitZ);
        // let cond4 = (newPlayerPos.x > rightLimitX && newPlayerPos.z < forwardLimitZ);

        // console.log("cond1: "+ cond1 + "\ncond2: " + cond2 +  "\ncond3: " + cond3  +  "\ncond4: " + cond4)

        
        let isMovementRestricted = (newPlayerPos.x < leftLimitXWithMargin && newPlayerPos.z > backwardLimitZWithMargin) ||  //bottom left
                                   (newPlayerPos.x > rightLimitXWithMargin && newPlayerPos.z > backwardLimitZWithMargin) ||  //bottom right
                                   (newPlayerPos.x < leftLimitXWithMargin && newPlayerPos.z < forwardLimitZWithMargin) ||  //top left
                                   (newPlayerPos.x > rightLimitXWithMargin && newPlayerPos.z < forwardLimitZWithMargin);    //top right
        if(!isMovementRestricted)
            playerPos.copy(newPlayerPos);
        else{
            //console.log("Stop right there")
        }
    }
/** 
*@param  {PlayerData} playerData
*/       
    checkAndUpdateState(playerData){

        let playerPos = playerData.playerPos;


        //if user decided to go back
        if(playerPos.z > this.backwardLimitZ){
           changeState(new StartState());
        }        

        //went front
        else if(playerPos.z < this.forwardLimitZ){
            changeState(new ForwardState());
        }

        //went to the right
        else if(playerPos.x > this.rightLimitX){
            changeState(new RightState());
        }

        //went to the left
        else if(playerPos.x < this.leftLimitX){
            changeState(new LeftState());
        }


    } 
}