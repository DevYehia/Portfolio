//This is the collision module (No Shit)
//Instead of checking each time collision with all objects
//we can check collision objects according to where the user is
//so here will be multiple states, including where the user is, what object to check for collision 
//and what hs next state is

import * as THREE from 'three';
import * as env from './environment';


const collisionMargin = 1;

class StartState{

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
*@param  {THREE.Vector3} playerPos
*/       
    checkAndUpdateState(playerPos){
        let limitZ = -(env.nearBoundaryCuboidDepth / 2);

        if(playerPos.z < limitZ){
            currState = new ForkRoadState();
        }
    }


}

class ForkRoadState{

    forwardLimitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth);
    backwardLimitZ = -(env.nearBoundaryCuboidDepth / 2);
    leftLimitX = -(env.pathWidth / 2);
    rightLimitX = env.pathWidth / 2;

    constructor(){
        //Here will be the logic to shift camera up
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
*@param  {THREE.Vector3} playerPos
*/       
    checkAndUpdateState(playerPos){


        //if user decided to go back
        if(playerPos.z > this.backwardLimitZ){
            currState = new StartState();
        }        

        //went front
        else if(playerPos.z < this.forwardLimitZ){
            currState = new ForwardState();
        }

        //went to the right
        else if(playerPos.x > this.rightLimitX){
            currState = new RightState();
        }

        //went to the left
        else if(playerPos.x < this.leftLimitX){
            currState = new LeftState();
        }


    } 
}

class LeftState{

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
*@param  {THREE.Vector3} playerPos
*/       
    checkAndUpdateState(playerPos){

        //if player goes back
        let backLimitX = env.pathWidth / 2;

        if(playerPos.x < backLimitX){
            currState = new ForkRoadState();
        }

    }


}

class RightState{

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
*@param  {THREE.Vector3} playerPos
*/       
    checkAndUpdateState(playerPos){
        //if player goes back
        let backLimitX = - (env.pathWidth / 2);

        if(playerPos.x > backLimitX){
            currState = new ForkRoadState();
        }
    }


}

class ForwardState{

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
*@param  {THREE.Vector3} playerPos
*/       
    checkAndUpdateState(playerPos){

        //if player goes back
        let limitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth);

        if(playerPos.z > limitZ){
            currState = new ForkRoadState();
        }
    }


}

export let currState = new StartState();