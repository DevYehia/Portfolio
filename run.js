import * as THREE from 'three';
import {addBoundaryCuboids, addGround, addHOFRoom, addMyRoom, addProjectsRoom,  addStars,  adjustPlayer, addFinalPart, addThanksMessage} from './environment';

import { changeState, currState } from './PlayerStates/common';
import { initKeyboardUtils, processKeyboardInput, resetKeys, isSinglePress } from './Utils/keyboardUtils';
import { currPauseState, pauseStates, setupPauseMenu, showPauseMenu, updatePauseState } from './pauseMenu';
import { loadingManager, loadStuff } from './loader';
import { setupStates} from './PlayerStates/states';
import { stateInstances } from './PlayerStates/common';
import { setUpAudio} from './Utils/audioUtils';
import { player } from './player'
import { handleMovement } from './movementManager';

let inPointerLock = false;



const scene = new THREE.Scene();




export const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio)
renderer.localClippingEnabled = true
document.body.appendChild( renderer.domElement );


await loadStuff()


//player stuff
let camera = player.camera

initKeyboardUtils()
setupPauseMenu()
setUpAudio()
adjustPlayer(player);
addBoundaryCuboids(scene)
addGround(scene)
addProjectsRoom(scene)
addHOFRoom(scene)
addMyRoom(scene)
addStars(scene)
addFinalPart(scene)
setupStates()
scene.add(player)


changeState(stateInstances["start"]);


const clock = new THREE.Clock();

function animate() {


    processKeyboardInput()

    const delta = clock.getDelta();

    //custom pointer lock exit
    if(isSinglePress('p')){

        document.exitPointerLock();
        if(currPauseState == pauseStates.NOT_PAUSED)
            showPauseMenu()
    }



    //movement logic
    handleMovement(delta)

    //check for next state
    currState.checkAndUpdateState(player);

    // console.log("Hello man")

    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );



//event listeners

document.body.addEventListener('click', () => {

    if(!player.inDialog && currPauseState == pauseStates.NOT_PAUSED){

        renderer.domElement.requestPointerLock();

    }
});

document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === renderer.domElement;
    inPointerLock = locked;
    document.getElementById("clickDiv").hidden = true;

    if(!locked){
        resetKeys()
        showPauseMenu()
        updatePauseState(pauseStates.PAUSED);
    }
    else{
        updatePauseState(pauseStates.NOT_PAUSED);
    }
    
    console.log(locked ? 'Pointer locked!' : 'Pointer released');
});





const clampMargin = Math.PI / 3;


camera.rotation.order = 'YXZ';

window.addEventListener('mousemove', e => {
    if(!inPointerLock || player.inInteraction || player.inDialog){
        return;
    }


    camera.rotation.y += -e.movementX * 0.002;
    let newCamRotX = camera.rotation.x + (-e.movementY * 0.002);
    if(newCamRotX < clampMargin && newCamRotX > -clampMargin)
        camera.rotation.x += -e.movementY * 0.002;


    
});


//for smooth experience
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    resetKeys()
    if(currPauseState == pauseStates.NOT_PAUSED)
        showPauseMenu()
    
  } else {
    //do nothing
  }
});


