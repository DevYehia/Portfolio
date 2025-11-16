import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { ProjectsState } from './ProjectsState';
import { ForkRoadState } from './forkRoadState';
import { getDistanceXZ } from '.././MathUtils';

export class LeftState{

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
     * @type {THREE.Mesh}
     */
    door

    doorTriggerDistance = 10

    constructor(){
        //get door
        this.door = env.projectsRoom.getObjectByName("door");
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

        //get lookAt
        playerData.camera.getWorldDirection(this.camLookAt);
        
        this.rayCaster.set(playerPos, this.camLookAt);

        let dist = getDistanceXZ(playerPos, this.door)

        let controlsDiv = document.getElementById("controlsDiv");

        //see the door and be at good distance
        if (this.rayCaster.intersectObject(this.door, false).length > 0 && dist <= this.doorTriggerDistance){
            controlsDiv.innerHTML = "Door<br>E - Open/Close";
            controlsDiv.hidden = false;
        }
        else{
            controlsDiv.hidden = true;
        }



        //if player goes back
        let backLimitX = -(env.pathWidth / 2);
        let forwardLimitX = -(env.pathWidth / 2 + env.boundaryCuboidWidth); 

        if(playerPos.x > backLimitX){
            changeState(new ForkRoadState());
        }
        else if(playerPos.x < forwardLimitX){
            changeState(new ProjectsState());
        }

    }


}