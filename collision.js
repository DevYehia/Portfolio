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
    hasReachedNextState(playerPos){
        let limitZ = -(env.nearBoundaryCuboidDepth / 2);

        return playerPos.z < limitZ;
    }

    updateCurrState(){
        
    }

}

export let currState = new StartState();