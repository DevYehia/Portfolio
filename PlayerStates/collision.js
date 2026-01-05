import * as THREE from 'three'
import { StateBorders } from './baseState'
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
 */

    collides(playerPos){
        
        for(let dirName in directions){
            let dir = directions[dirName]

            //skip check if null
            if(this.stateBorders[dirName] == null)continue;

            let axisSign = dir.charAt(0)
            let axis = dir.charAt(1)
            let otherAxis = perpenDict[dir].charAt(1);
            let otherAxisSign = (perpenDict[dir].charAt(0) == '+') ? 1 : -1;

            let border = this.stateBorders[dirName]
            let door = this.stateDoors[dirName]
            let doorPos = (door != null) ? door.getWorldPos() : null;
            let cond = (axisSign == '+') ? (playerPos[axis] > border) : (playerPos[axis] < border)

            console.log("this is " + doorPos?.[otherAxis] + door?.doorWidth * otherAxisSign)

            if(cond &&
                (door == null || !(
                    door.isOpen() &&
                    isBetween(doorPos[otherAxis], doorPos[otherAxis] + door.doorWidth * otherAxisSign, playerPos[otherAxis])
                    )
                )
            )return true;

        }


        return false;


    }


}