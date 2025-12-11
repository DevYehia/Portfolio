import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { LeftState } from './leftState'
import { getDistanceXZ } from '../Utils/MathUtils';
import { projectsData } from '../Data/projects';
import { animateText } from '../Utils/textUtils';
import { BaseState } from './baseState';
import { ProjectsRoom } from '../Rooms/projectsRoom';
import { keys, KeyStates } from '../Utils/keyboardUtils';
import { endDialogue, nextLine, startDialogue } from '../Utils/dialogUtils';

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

    signTriggerDistance = 20;

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
        //this.lightInterval = setInterval(this.incLight.bind(this), 1 / 1000);

    }


    incLight(){

        this.projectsRoom.roomLight.intensity += 1 / 1000;
       // console.log("Light is " + this.ambLight.intensity)
        if(this.projectsRoom.roomLight.intensity >= 1){
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
        let camera = playerData.camera;

        let controlsDiv = document.getElementById("controlsDiv");

        let signsList = this.projectsRoom.signsList;

        playerData.camera.getWorldDirection(this.camLookAt);
        
        this.rayCaster.set(playerPos, this.camLookAt);

        let dist = getDistanceXZ(playerPos, this.door.doorMesh)

        //check for door collision
        //see the door and be at good distance
        if (this.checkForTrigger(dist, this.doorTriggerDistance, camera, this.door.hitBox)){
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
            if(!this.checkForTrigger(dist, this.signTriggerDistance, camera, this.currTriggeredSign.hitBox)){
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
                if(this.checkForTrigger(dist, this.signTriggerDistance, camera, currSign.hitBox)){

                        currSign.trigger();
                        this.currTriggeredSign = currSign;

                        //show the controlsDiv
                        controlsDiv.innerHTML = "Sign<br>V - Show Video<br>E - Interact<br>G - Github";
                        controlsDiv.hidden = false;

                        foundSign = true;

                        break; //found a sign,end loop

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
            startDialogue(projectsData[signID].dialogue)
        }
        else if(this.isInDialog && usedKeys["q"] == KeyStates.SINGLE_PRESS){
            let areThereMoreLines = nextLine()
            this.isInDialog = areThereMoreLines;
        }
        else if(usedKeys["g"] == KeyStates.SINGLE_PRESS){
            console.log("aloalo")
            window.open(projectsData[signID].github)
        }
        //end dialogue
        else if(this.isInDialog && usedKeys["x"] == KeyStates.SINGLE_PRESS){
            endDialogue()
            this.isInDialog = false;
        }

        else if(!this.isInDialog && usedKeys["v"] == KeyStates.SINGLE_PRESS){
            let video = projectsData[signID].video
            if(video != null){
                window.open(video)
            }
            else{
                this.isInDialog = true
                startDialogue(["No video here bud"])
            }
        }
    }


}