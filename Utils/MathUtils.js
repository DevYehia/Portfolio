import * as THREE from 'three'

const tmpPos = new THREE.Vector3()

export function getDistanceXZ(playerPos, object){
        object.getWorldPosition(tmpPos)
        let zDiff = playerPos.z - tmpPos.z;
        let xDiff = playerPos.x - tmpPos.x;
        let dist = Math.sqrt(zDiff*zDiff + xDiff*xDiff);
        return dist;
    }

export function isBetween(val1, val2, target){
    let mini = Math.min(val1, val2)
    let maxi = Math.max(val1, val2)
    return (target < maxi && target > mini) 
}

export function getclosestDistance(pos, borders){
    return Math.min(pos.z - borders.forward,
        borders.backward - pos.z,
        borders.right - pos.x,
        pos.x - borders.left 
    )
}