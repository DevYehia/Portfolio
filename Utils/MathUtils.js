import * as THREE from 'three'

const tmpPos = new THREE.Vector3()

export function getDistanceXZ(playerPos, object){
        object.getWorldPosition(tmpPos)
        let zDiff = playerPos.z - tmpPos.z;
        let xDiff = playerPos.x - tmpPos.x;
        let dist = Math.sqrt(zDiff*zDiff + xDiff*xDiff);
        return dist;
    }