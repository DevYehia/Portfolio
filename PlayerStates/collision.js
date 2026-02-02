import * as THREE from 'three'
import { Door } from '../Objects/door'
import { directions } from './common'
import { isBetween } from '../Utils/MathUtils'


export class CollisionBorders{


    forward
    backward
    left
    right
    constructor({
        forward = null,
        backward = null,
        left = null,
        right = null
    } = {}){
        this.forward = forward
        this.left = left
        this.right = right
        this.backward = backward
    }
}




export class StateDoors{


    /**@type {Door} */
    forward
    /**@type {Door} */
    backward
    /**@type {Door} */
    left
    /**@type {Door} */
    right
    constructor({
        forward = null,
        backward = null,
        left = null,
        right = null
    } = {}){
        this.forward = forward
        this.left = left
        this.right = right
        this.backward = backward
    }
}

const perpenDict = {
    "+x" : "+z",
    "-x" : "-z",
    "+z" : "-x",
    "-z" : "+x"
}



export class CollisionHandler{


    playerLocalPos = new THREE.Vector3(); //will be used relative to doors


/**
 * @param {CollisionBorders} stateBorders
 * @param {StateDoors} stateDoors
 */
    constructor(stateBorders, stateDoors){
        this.stateBorders = stateBorders;
        this.stateDoors = stateDoors;
    }

/**
 * 
 * @param {THREE.Vector3} playerPos 
 * @param {THREE.Vector3} newPlayerPos 
 */

    modifyPosition(playerPos, newPlayerPos){


        const modifyAxis = {
            "x" : true,
            "z" : true
        }
        
        for(let dirName in directions){
            let dir = directions[dirName]

            //skip check if null
            if(this.stateBorders[dirName] == null)continue;

            let axisSign = dir.charAt(0)
            let axis = dir.charAt(1)
            let otherAxis = perpenDict[dir].charAt(1);


            let border = this.stateBorders[dirName]
            let door = this.stateDoors[dirName]
        
            let doorPos = (door != null) ? door.getWorldPos() : null;
            let cond = (axisSign == '+') ? (newPlayerPos[axis] > border) : (newPlayerPos[axis] < border)
            let unStuckCond = (axisSign == '+') ? (playerPos[axis] > border) : (playerPos[axis] < border)


            if( door != null &&
                isBetween(doorPos[otherAxis], doorPos[otherAxis] + door.doorWidth * door.sign, playerPos[otherAxis])
            && door.isOpen()){
                //don't unstuck
            }
            else if(
                unStuckCond
            ) {
                playerPos[axis] = border;
                modifyAxis[axis] = false
            }
            

            //collision code
            if(door == null){
                if(cond)modifyAxis[axis] = false;
            }

            else if(!isBetween(doorPos[otherAxis], doorPos[otherAxis] + door.doorWidth * door.sign, playerPos[otherAxis])){
                if(cond)modifyAxis[axis] = false;
            }
            
            else{
                if(!door.isOpen() && cond)modifyAxis[axis] = false
                else if(door.isOpen());// do nothing
            }
        }

        //check for modifications
        for(let axis in modifyAxis){
            if(modifyAxis[axis])playerPos[axis] = newPlayerPos[axis];
        }

    }


}