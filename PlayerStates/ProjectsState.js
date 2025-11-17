import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { LeftState } from './leftState'
import { getDistanceXZ } from '.././MathUtils';

export class ProjectsState{

    signTriggerDistance = 10;
    currTriggeredSign = null;

    constructor(){

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

                let dist = getDistanceXZ(playerPos, currSign.main)
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
            changeState(new LeftState());
        }

    }

    //for optimization
    tmpSignPos = new THREE.Vector3();

    /** 
    *@param  {Sign} sign
    */       
    //here we calulate distance based on x and z, y doesnt matter
    getPlayerAndSignDistance(playerPos, sign){
        sign.main.getWorldPosition(this.tmpSignPos)
        let zDiff = playerPos.z - this.tmpSignPos.z;
        let xDiff = playerPos.x - this.tmpSignPos.x;
        let dist = Math.sqrt(zDiff*zDiff + xDiff*xDiff);
        return dist;
    }


}