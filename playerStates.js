//This is the collision module (No Shit)
//Instead of checking each time collision with all objects
//we can check collision objects according to where the user is
//so here will be multiple states, including where the user is, what object to check for collision 
//and what hs next state is

import * as THREE from 'three';
import * as env from './environment';


const collisionMargin = 1;



//this is a helper class
//it is needed because some states need access to camera and others don't
//so we will just pass this object
//don't ask me it is ChatGPT recommendation
export class PlayerData{

  /** @type {THREE.Vector3} */
  playerPos;

  /** @type {THREE.Camera} */
  camera

  /** @type {THREE.Scene} */
  scene;


  constructor(playerPos, camera, scene) {
    this.playerPos = playerPos;
    this.camera = camera;
    this.scene = scene;
  }    
}

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
*@param  {PlayerData} playerData
*/       
    checkAndUpdateState(playerData){
        let playerPos = playerData.playerPos;
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
*@param  {PlayerData} playerData
*/       
    checkAndUpdateState(playerData){

        let playerPos = playerData.playerPos;


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
*@param  {PlayerData} playerData
*/       
    checkAndUpdateState(playerData){
        let playerPos = playerData.playerPos;
        //if player goes back
        let backLimitX = -(env.pathWidth / 2);
        let forwardLimitX = -(env.pathWidth / 2 + env.boundaryCuboidWidth); 

        if(playerPos.x > backLimitX){
            currState = new ForkRoadState();
        }
        else if(playerPos.x < forwardLimitX){
            currState = new ProjectsState();
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
*@param  {PlayerData} playerData
*/       
    checkAndUpdateState(playerData){
        console.log("in right state and x is " + playerData.playerPos.x);
        let playerPos = playerData.playerPos;
        //if player goes back
        let backLimitX =  (env.pathWidth / 2);

        if(playerPos.x < backLimitX){
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
*@param  {PlayerData} playerData
*/       
    checkAndUpdateState(playerData){
        let playerPos = playerData.playerPos;
        //if player goes back
        let limitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth);

        if(playerPos.z > limitZ){
            currState = new ForkRoadState();
        }
    }


}

class ProjectsState{

    signTriggerDistance = 10;
    currTriggeredSign = null;

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

        let controlsDiv = document.getElementById("controlsDiv");
        //according to player's position we find the nearest sign
        let signsList = env.signs;

        //get lookAt
        let camLookAt = new THREE.Vector3();
        playerData.camera.getWorldDirection(camLookAt);
        
        let rayCaster = new THREE.Raycaster();

        rayCaster.set(playerPos, camLookAt);

        //first we check the current looked at sign
        console.log("Sign now is " + this.currTriggeredSign)
        if(this.currTriggeredSign != null){
           //console.log("Entered currSign check")
            let dist = this.getPlayerAndSignDistance(playerPos, this.currTriggeredSign)
            //if distance is exceeded or sign is no longer looked at
            if(dist > this.signTriggerDistance || 
            rayCaster.intersectObject(this.currTriggeredSign.main, false).length == 0){
                this.currTriggeredSign.revertColor();
                this.currTriggeredSign = null;
                controlsDiv.hidden = true;
            }
            else{
                //hide controls div

            }
        }

        else{
            console.log("In Else")
            for(let i = 0 ; i < signsList.length ; i++){
                let currSign = signsList[i];

                let dist = this.getPlayerAndSignDistance(playerPos, currSign)
                //console.log("dist is " + dist)
                //check if i look at sign, it is lower than trigger distance
                if(dist < this.signTriggerDistance){
                    //console.log("in first if");
                    if(rayCaster.intersectObject(currSign.main, false).length > 0){
                       // console.log("in sconed if");
                        currSign.changeColor();
                        this.currTriggeredSign = currSign;

                        //show the controlsDiv
                        controlsDiv.innerHTML = "Sign<br>V - Show Video<br>E - Interact";
                        controlsDiv.hidden = false;

                        break; //found a sign,end loop
                    }

                }
            }
        }



        //if player goes back
        let backLimitX = - (env.pathWidth / 2 + env.boundaryCuboidWidth);

        if(playerPos.x > backLimitX){
            currState = new ForkRoadState();
        }

    }
    //here we calulate distance based on x and z, y doesnt matter
    getPlayerAndSignDistance(playerPos, sign){
        let zDiff = playerPos.z - sign.main.position.z;
        let xDiff = playerPos.x - sign.main.position.x;
        let dist = Math.sqrt(zDiff*zDiff + xDiff*xDiff);
        return dist;
    }


}


export let currState = new StartState();