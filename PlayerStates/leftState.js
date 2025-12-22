import * as THREE from 'three';
import * as env from '../environment';
import {PlayerData, collisionMargin, changeState} from './common';
import { ProjectsState } from './ProjectsState';
import { ForkRoadState } from './forkRoadState';
import { getDistanceXZ } from '../Utils/MathUtils';
import { Door } from '../Objects/door';
import { BaseState } from './baseState';
import { keys, KeyStates} from '../Utils/keyboardUtils'

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

        this.interactableList = [env.projectsRoom.door]
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


        if((newPlayerPos.x >= forwardLimitX) || 
            (this.door.isOpen() && 
            newPlayerPos.z < doorLeftZ && 
            newPlayerPos.z > doorRightZ)){
                playerPos.x = newPlayerPos.x;
            }

        //unstuck player
        if(playerPos.x < forwardLimitX && !this.door.isOpen()){
            playerPos.x = forwardLimitX + 1
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


        this.checkInteraction(playerPos, playerData.camera)




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