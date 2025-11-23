import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { LeftState } from './leftState'
import { getDistanceXZ } from '.././MathUtils';
import { projectsData } from '../projects';
import { animateText } from '../textUtils';
import { BaseState } from './baseState';
import { ProjectsRoom } from '../Rooms/projectsRoom';
import { keys, KeyStates } from '../keyboardUtils';

export class ProjectsState extends BaseState{

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

    currDialogLineIdx = 0;

    /**
     * @type {ProjectsRoom}
     */
    projectsRoom


    lightInterval;

    constructor(){
        super()
        this.door = env.projectsRoom.door
        //start lighting animation
        this.projectsRoom = env.projectsRoom;
        //console.log(JSON.stringify(this.ambLight))
        this.lightInterval = setInterval(this.incLight.bind(this), 1 / 1000);

    }


    incLight(){
        console.log("Light is " + JSON.stringify(this.ambLight))
        this.projectsRoom.ambLight.intensity += 1 / 1000;
       // console.log("Light is " + this.ambLight.intensity)
        if(this.projectsRoom.ambLight.intensity >= 1){
            clearInterval(this.lightInterval)
        }
    }

/** 
*@param  {THREE.Vector3} playerPos
*@param  {THREE.Vector3} newPlayerPos

*/


    modifyPosition(playerPos, newPlayerPos){

        //if in dialog, respct the dialog
        if(this.isInDialog){
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


        let usedKeys = keys;

        let playerPos = playerData.playerPos;

        let controlsDiv = document.getElementById("controlsDiv");

        let signsList = this.projectsRoom.signsList;

        playerData.camera.getWorldDirection(this.camLookAt);
        
        this.rayCaster.set(playerPos, this.camLookAt);

        let dist = getDistanceXZ(playerPos, this.door.doorMesh)

        //check for door collision
        //see the door and be at good distance
        if (dist <= this.doorTriggerDistance && this.rayCaster.intersectObject(this.door.doorMesh, false).length > 0 ){
            controlsDiv.innerHTML = "Door<br>E - Open/Close";
            controlsDiv.hidden = false;

            //now check for keyboard input
            if(keys["e"] == KeyStates.SINGLE_PRESS || keys["e"] == KeyStates.LONG_PRESS){
                this.door.trigger();
            }
            return //don't continue to sign checking , no need

        }
        else{
            //controlsDiv.hidden = true;
        }        


        //according to player's position we find the nearest sign

        //check current triggered sign
    
        if(this.currTriggeredSign != null){
           //console.log("Entered currSign check")
            let dist = this.getPlayerAndSignDistance(playerPos, this.currTriggeredSign)
            //if distance is exceeded or sign is no longer looked at
            if(dist > this.signTriggerDistance || 
            this.rayCaster.intersectObject(this.currTriggeredSign.main, false).length == 0){
                this.currTriggeredSign.revert();
                this.currTriggeredSign = null;
                controlsDiv.hidden = true;
            }
            else{ //still triggering sign, handle interactions
                this.handleInput(usedKeys)
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
                        currSign.trigger();
                        this.currTriggeredSign = currSign;

                        //show the controlsDiv
                        controlsDiv.innerHTML = "Sign<br>V - Show Video<br>E - Interact<br>G - Github";
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


        //handle state change

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

    handleInput(usedKeys){
        let controlsDiv = document.getElementById("controlsDiv");
        let signID = this.currTriggeredSign.signID;
        if(!this.isInDialog && usedKeys["e"] == KeyStates.SINGLE_PRESS){
            this.isInDialog = true;
            this.currDialogLineIdx = 0;

            //show dialogue controls
            controlsDiv.innerHTML = "Q - Next Line<br>X - Skip All"
            controlsDiv.hidden = false;

            let talkDiv = document.getElementById("talkDiv");
            talkDiv.hidden = false;
            animateText(talkDiv, projectsData[signID].dialogue[this.currDialogLineIdx])
            this.currDialogLineIdx++;
        }
        else if(this.isInDialog && usedKeys["q"] == KeyStates.SINGLE_PRESS){
            let dialogueList = projectsData[signID].dialogue;
            if(this.currDialogLineIdx < dialogueList.length){ //there ares still more lines{
                animateText(talkDiv, dialogueList[this.currDialogLineIdx])
                this.currDialogLineIdx++;
            }
            else{ //end of dialog
                talkDiv.hidden = true;
                controlsDiv.hidden = true;
                this.isInDialog = false;
            }
        }
        else if(usedKeys["g"] == KeyStates.SINGLE_PRESS){
            console.log("aloalo")
            window.open(projectsData[signID].github)
        }
        //end dialogue
        else if(this.isInDialog && usedKeys["x"] == KeyStates.SINGLE_PRESS){
            talkDiv.hidden = true;
            controlsDiv.hidden = true;
            this.isInDialog = false;
        }
    }


}