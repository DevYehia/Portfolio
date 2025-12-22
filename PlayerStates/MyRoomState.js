import * as THREE from 'three';
import {PlayerData, collisionMargin, changeState} from './common';
import { LeftState } from './leftState'
import { getDistanceXZ } from '../Utils/MathUtils';
import { projectsData } from '../Data/projects';
import { animateText } from '../Utils/textUtils';
import { BaseState } from './baseState';
import { ProjectsRoom } from '../Rooms/projectsRoom';
import { keys, KeyStates } from '../Utils/keyboardUtils';
import { endDialogue, nextLine, startDialogue } from '../Utils/dialogUtils';
import { myRoom } from '../environment';

export class MyRoomState extends BaseState{





    lightInterval;

    constructor(){
        super()

        console.log("E7a hena")

        this.interactableList = [myRoom.door, ...myRoom.signsList]


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

        // let fowardLimitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth - collisionMargin);
        // let backLimitZ = -(env.nearBoundaryCuboidDepth / 2 + collisionMargin);

        //x will be updated regardless
        playerPos.x = newPlayerPos.x;
        playerPos.z = newPlayerPos.z;
        return;

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

        let playerPos = playerData.playerPos

        //animate  collectible particles
        // if(env.projectsRoom.certificate != null){
        //     env.projectsRoom.certificate.animate()
        // }

        this.handleDialog()

        if(!this.isInDialog)
            this.checkInteraction(playerPos, playerData.camera)

        if(keys['b'] == KeyStates.SINGLE_PRESS){
            myRoom.skillsBoardGroup.getNextSkill()
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