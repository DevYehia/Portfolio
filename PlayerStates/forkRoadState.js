import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { LeftState } from './leftState'
import { StartState } from './startState';
import { RightState } from './rightState';
import { ForwardState } from './forwardState'
import { BaseState } from './baseState';
import { BoxCollision } from '../CollisionHandlers/BoxCollision';



export class ForkRoadState extends BaseState{

    forwardLimitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth);
    backwardLimitZ = -(env.nearBoundaryCuboidDepth / 2);
    leftLimitX = -(env.pathWidth / 2);
    rightLimitX = env.pathWidth / 2;

    collider;

    constructor(){
        //Here will be the logic to shift camera up
        super();

        this.collider = new BoxCollision(this.leftLimitX, this.rightLimitX, this.backwardLimitZ, this.forwardLimitZ)


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



        if(1 ||  !this.collider.doesCollide(newPlayerPos))
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