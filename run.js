import * as THREE from 'three';
import {addAmbientLight, addBoundaryCuboids, addGround, addHOFRoom, addMyRoom, addProjectsRoom,  addStars,  adjustCamera} from './environment';

import { PlayerData, changeState, currState } from './PlayerStates/common';
import { KeyStates, keys, initKeyboardUtils, processKeyboardInput, resetKeys } from './Utils/keyboardUtils';
import { setupPauseMenu } from './pauseMenu';
import { loadStuff } from './loader';

import { gsap } from 'gsap/gsap-core';
import { setupStates, stateInstances } from './PlayerStates/states';
import { certificates } from './Data/certificates';





let optionsMenuDiv = document.getElementById("menuButton")
let inPointerLock = false;



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const moveSpeed = 20



export const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio)
renderer.localClippingEnabled = true
document.body.appendChild( renderer.domElement );
renderer.localClippingEnabled = true;

await loadStuff()

initKeyboardUtils()
setupPauseMenu()

//important to start game



adjustCamera(camera);

addBoundaryCuboids(scene, 30)

addGround(scene)
//addSigns(scene)


let playerData = new PlayerData(camera.position, camera, scene, keys);


// addDoor(scene)
addProjectsRoom(scene)
addHOFRoom(scene)
addMyRoom(scene)
addStars(scene)
addAmbientLight(scene)


setupStates()
changeState(stateInstances["start"]);



let pointLight = new THREE.PointLight(0xFFFFFF, 100, 0)
scene.add(pointLight)

 let ambLight = new THREE.AmbientLight(0xffffff, 0.1)
 //scene.add(ambLight)

pointLight.position.copy(camera.position)


const clock = new THREE.Clock();



function animate() {



    processKeyboardInput()

    const delta = clock.getDelta();

    if( keys['z'] == KeyStates.SINGLE_PRESS){
      gsap.to(
        mesh.position,
        {
          z : mesh.position.z == -30 ? 0 : - 30,
          duration: 1
        }
      )
    }

   //console.log("oh delta is " + delta)


    //testDoor.door.rotation.y += 0.1

    //movement logic
    if(!currState.isInDialog){
        let camLookAt = new THREE.Vector3;
        camera.getWorldDirection(camLookAt);

        //to get perpendicular we cross product with up vector
        //this gives vector to left of look at vector
        let perpendicularToCamLookAt = new THREE.Vector3(0,1,0).cross(camLookAt).normalize();

        let finalMoveSpeed = moveSpeed * delta

        //create a newPos vector, and add to it the movement
        let newPos = new THREE.Vector3().copy(camera.position)
        if(keys['w'] == KeyStates.SINGLE_PRESS || keys['w'] == KeyStates.LONG_PRESS){
            newPos.z += camLookAt.z * finalMoveSpeed;
            newPos.x += camLookAt.x * finalMoveSpeed;
        }
        else if(keys['s'] == KeyStates.SINGLE_PRESS || keys['s'] == KeyStates.LONG_PRESS){
            newPos.z -= camLookAt.z * finalMoveSpeed;
            newPos.x -= camLookAt.x * finalMoveSpeed
        }

        if(keys['a'] == KeyStates.SINGLE_PRESS || keys['a'] == KeyStates.LONG_PRESS){
            newPos.z += perpendicularToCamLookAt.z * finalMoveSpeed;
            newPos.x += perpendicularToCamLookAt.x * finalMoveSpeed;   
            //testDoor.open()      
            //testDoor.doorMesh.scale.set(20,20,1)   
        }
        else if(keys['d'] == KeyStates.SINGLE_PRESS || keys['d'] == KeyStates.LONG_PRESS){
            newPos.z -= perpendicularToCamLookAt.z * finalMoveSpeed;
            newPos.x -= perpendicularToCamLookAt.x * finalMoveSpeed;    
            //testDoor.close()          
        }

        if(keys['q'] == KeyStates.SINGLE_PRESS){
          pointLight.intensity = ((pointLight.intensity == 0) ? 100 : 0);
        }

        //check for collision using newPos
        // if(!currState.checkCollision(newPos)){
        //     //copy change to camera position
        //     camera.position.copy(newPos);
        // }
        currState.modifyPosition(camera.position, newPos);
        currState.modifyPosition(pointLight.position, newPos);


    }

    //check for next state
    currState.checkAndUpdateState(playerData);

    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );



//event listeners

document.body.addEventListener('click', () => {
    if(!currState.isInDialog)
        renderer.domElement.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  const locked = document.pointerLockElement === renderer.domElement;
  inPointerLock = locked;
  document.getElementById("clickDiv").hidden = locked;

  if(!locked){
    resetKeys()
    optionsMenuDiv.hidden = false;
  }
  else{
    optionsMenuDiv.hidden = true;
  }
  
  console.log(locked ? 'Pointer locked!' : 'Pointer released');
});





const clampMargin = Math.PI / 3;


camera.rotation.order = 'YXZ';

window.addEventListener('mousemove', e => {
    if(!inPointerLock || currState.isInDialog){
        return;
    }


    // if(e.movementX != 0){
    //     camera.rotateOnWorldAxis(up, -e.movementX * 0.002)
    // }
    // let eulerRot = new THREE.Euler( 0, 0, 0, 'YXZ' );
    // eulerRot.setFromQuaternion(camera.quaternion);

    // eulerRot.y += -e.movementX * 0.002;
    // eulerRot.x += -e.movementY * 0.002;

    // camera.quaternion.setFromEuler(eulerRot);
    camera.rotation.y += -e.movementX * 0.002;
    let newCamRotX = camera.rotation.x + (-e.movementY * 0.002);
    if(newCamRotX < clampMargin && newCamRotX > -clampMargin)
        camera.rotation.x += -e.movementY * 0.002;


    
});


//for smooth experience
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    resetKeys()
  } else {
    //do nothing
  }
});


