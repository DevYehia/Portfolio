import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { LeftState } from './leftState'
import { getDistanceXZ } from '.././MathUtils';
import { projectsData } from '../projects';
import { animateText } from '../textUtils';

export class ProjectsState{

   //for checking collision with door

    /**
     * @type {THREE.Vector3}
     */
    camLookAt = new THREE.Vector3()

    /**
     * @type {THREE.Raycaster}
     */
    rayCaster = new THREE.Raycaster()

    /**
     * @type {Door}
     */
    door

    doorTriggerDistance = 10

    signTriggerDistance = 10;

    /**
     * @type {Sign}
     */    
    currTriggeredSign = null;

    inDialog = false //to check if user is in dialog (no shit)

    currDialogLineIdx = 0;

    origInputKeys = {};

    constructor(){
        this.door = env.projectsRoomDoor
    }

/** 
*@param  {THREE.Vector3} playerPos
*@param  {THREE.Vector3} newPlayerPos

*/


    modifyPosition(playerPos, newPlayerPos){

        //if in dialog, respct the dialog
        if(this.inDialog){
            return;
        }

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



        let inputKeys = playerData.inputKeys;

        let usedKeys = {};

        let playerPos = playerData.playerPos;


        //check for single presses, will be moved later to a base class;
        for(let key in inputKeys){
            if(this.origInputKeys[key] == true && inputKeys[key] == true){
                usedKeys[key] = false;
            }
            else if(this.origInputKeys[key] != true && inputKeys[key] == true){
                usedKeys[key] = true;
            }
            else{
                usedKeys[key] = false;
            }
            this.origInputKeys[key] = inputKeys[key];
        }

        let controlsDiv = document.getElementById("controlsDiv");

        let signsList = env.signs;


        playerData.camera.getWorldDirection(this.camLookAt);
        
        this.rayCaster.set(playerPos, this.camLookAt);

        let dist = getDistanceXZ(playerPos, this.door.doorMesh)

        //check for door collision
        //see the door and be at good distance
        if (dist <= this.doorTriggerDistance && this.rayCaster.intersectObject(this.door.doorMesh, false).length > 0 ){
            controlsDiv.innerHTML = "Door<br>E - Open/Close";
            controlsDiv.hidden = false;

            //now check for keyboard input
            if(playerData.inputKeys["e"] == true){
                env.projectsRoomDoor.trigger();
            }
            return //don't continue to sign checking , no need

        }
        else{
            //controlsDiv.hidden = true;
        }        


        //according to player's position we find the nearest sign
        //first we check the current looked at sign
        console.log("Sign now is " + this.currTriggeredSign)
        if(this.currTriggeredSign != null){
           //console.log("Entered currSign check")
            let dist = this.getPlayerAndSignDistance(playerPos, this.currTriggeredSign)
            //if distance is exceeded or sign is no longer looked at
            if(dist > this.signTriggerDistance || 
            this.rayCaster.intersectObject(this.currTriggeredSign.main, false).length == 0){
                this.currTriggeredSign.revertColor();
                this.currTriggeredSign = null;
                controlsDiv.hidden = true;
            }
            else{ //still triggering sign, handle interactions
                if(!this.inDialog && usedKeys["e"] == true){
                    console.log("Hey am here")
                    this.inDialog = true;
                    this.currDialogLineIdx = 0;
                    let signID = this.currTriggeredSign.signID;
                    console.log("Sign id " + signID)
                    let talkDiv = document.getElementById("talkDiv");
                    talkDiv.hidden = false;
                    animateText(talkDiv, projectsData[signID].dialogue[this.currDialogLineIdx])
                    this.currDialogLineIdx++;
                }
                else if(this.inDialog && usedKeys["q"] == true){
                    let signID = this.currTriggeredSign.signID;
                    let dialogueList = projectsData[signID].dialogue;
                    if(this.currDialogLineIdx < dialogueList.length){ //there ares still more lines{
                        animateText(talkDiv, dialogueList[this.currDialogLineIdx])
                        this.currDialogLineIdx++;
                    }
                    else{ //end of dialog
                        talkDiv.hidden = true;
                        this.inDialog = false;
                    }
                }
            }
        }

        else{
            let foundSign = false;
            for(let i = 0 ; i < signsList.length ; i++){
                let currSign = signsList[i];

                let dist = getDistanceXZ(playerPos, currSign.main)
                //console.log("dist is " + dist)
                //check if i look at sign, it is lower than trigger distance
                if(dist < this.signTriggerDistance){
                    //console.log("in first if");
                    if(this.rayCaster.intersectObject(currSign.main, false).length > 0){
                       // console.log("in sconed if");
                        currSign.changeColor();
                        this.currTriggeredSign = currSign;

                        //show the controlsDiv
                        controlsDiv.innerHTML = "Sign<br>V - Show Video<br>E - Interact";
                        controlsDiv.hidden = false;

                        foundSign = true;

                        break; //found a sign,end loop
                    }

                }
            }

            if(!foundSign){
                controlsDiv.hidden = true; //didn't trigger any door or sign
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