import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { ProjectsState } from './ProjectsState';
import { ForkRoadState } from './forkRoadState';
import { getDistanceXZ } from '.././MathUtils';
import { Door } from '../Objects/door';
import { BaseState } from './baseState';
import { keys, KeyStates} from '../keyboardUtils'

export class LeftState extends BaseState{

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


    constructor(){
        super()
        //get door
        this.door = env.projectsRoom.door;
    }


/** 
*@param  {THREE.Vector3} playerPos
*@param  {THREE.Vector3} newPlayerPos
*/        
    modifyPosition(playerPos, newPlayerPos){

        let forwardLimitX = -(env.pathWidth / 2 + env.boundaryCuboidWidth) + collisionMargin; 

        let fowardLimitZ = -(env.nearBoundaryCuboidDepth / 2 + env.pathWidth - collisionMargin);
        let backLimitZ = -(env.nearBoundaryCuboidDepth / 2 + collisionMargin);

        let doorWorldPos = this.door.getWorldPos();
        let doorLeftZ = doorWorldPos.z;
        let doorRightZ = doorWorldPos.z - this.door.doorWidth;

        //console.log("doorLfetZ is " + doorLeftZ + " right is " + doorRightZ + " my left is " + newPlayerPos.z)
    

        //x will be updated according to the door
        if(newPlayerPos.x >= forwardLimitX || 
            (this.door.isOpen() && 
            newPlayerPos.z < doorLeftZ && 
            newPlayerPos.z > doorRightZ)){
                playerPos.x = newPlayerPos.x;
            }


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

        let dist = getDistanceXZ(playerPos, this.door.doorMesh)

        let controlsDiv = document.getElementById("controlsDiv");

        //see the door and be at good distance
        if (this.rayCaster.intersectObject(this.door.doorMesh, false).length > 0 && dist <= this.doorTriggerDistance){
            controlsDiv.innerHTML = "Door<br>E - Open/Close";
            controlsDiv.hidden = false;

            //now check for keyboard input
            if(keys["e"] == KeyStates.SINGLE_PRESS || keys["e"] == KeyStates.LONG_PRESS){
                this.door.trigger();
            }

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

        //go to project state if door is opened
        else if(playerPos.x < forwardLimitX){
            changeState(new ProjectsState());
        }

    }


}