import * as THREE from 'three'
import { isPressed } from './Utils/keyboardUtils';
import { player } from "./player";
import { audios } from './Utils/audioUtils';
import { currState } from './PlayerStates/common';

const moveSpeed = 20


const straightMoveKeys = {'w' : 1, 's' : -1}
const perpendicularMoveKeys = {'a' : 1, 'd': -1}

function onMove(){
    let walkingAudio = audios["walk"]
    walkingAudio?.play()
}

function onStop(){
    let walkingAudio = audios["walk"]
    if(!walkingAudio)return
    walkingAudio.pause()
    walkingAudio.currentTime = 0    
}

export function handleMovement(delta){ //delta used to make different fps machines move at same speed per second

    
    if(player.inDialog || player.inInteraction){
        onStop();
        return;
    }; //in dialog no movement

    let camera = player.camera
    let camLookAt = new THREE.Vector3;
    camera.getWorldDirection(camLookAt);

    //remove y component, so it doesn't alter movement
    camLookAt.y = 0;
    camLookAt.normalize()

    //to get perpendicular we cross product with up vector
    //this gives vector to left of look at vector
    let perpendicularToCamLookAt = new THREE.Vector3(0,1,0).cross(camLookAt).normalize();

    let finalMoveSpeed = moveSpeed * delta

    //create a newPos vector, and add to it the movement
    let newPos = new THREE.Vector3().copy(player.position)

    for(let key in straightMoveKeys){
        let moveSign = straightMoveKeys[key]
        if(isPressed(key)){
            newPos.add(camLookAt.multiplyScalar(moveSign * finalMoveSpeed)) //camLookAt has y = 0 so won't change y
        }
    }

    for(let key in perpendicularMoveKeys){
        let moveSign = perpendicularMoveKeys[key]
        if(isPressed(key)){
            newPos.add(perpendicularToCamLookAt.multiplyScalar(moveSign * finalMoveSpeed)) //camLookAt has y = 0 so won't change y
        }
    }

    let walkingAudio = audios["walk"]
    if(!player.position.equals(newPos)){ //movement keys pressed

        currState.modifyPosition(player.position, newPos);


        if(player.position.equals(newPos)){ //position updated (no collision)
            onMove()
        }
        else{ //collision
            onStop()
        }

    }
    else{ //no movement keys pressed
        onStop()
    }
}