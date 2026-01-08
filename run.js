import * as THREE from 'three';
import {addAmbientLight, addBoundaryCuboids, addGround, addHOFRoom, addMyRoom, addProjectsRoom,  addStars,  adjustCamera, pathWidth} from './environment';

import { PlayerData, changeState, currState } from './PlayerStates/common';
import { KeyStates, keys, initKeyboardUtils, processKeyboardInput, resetKeys } from './Utils/keyboardUtils';
import { setupPauseMenu } from './pauseMenu';
import { loadStuff } from './loader';

import { gsap } from 'gsap/gsap-core';
import { setupStates, stateInstances } from './PlayerStates/states';
import { certificates } from './Data/certificates';
import { Player } from './player';
import { getclosestDistance } from './Utils/MathUtils';





let optionsMenuDiv = document.getElementById("menuButton")
let inPointerLock = false;



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const moveSpeed = 20

let dict = {"yaya" : true}
console.log(dict["lla"] + "eih")


export const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio)
renderer.localClippingEnabled = true
document.body.appendChild( renderer.domElement );


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


const geometry = new THREE.ConeGeometry(
  1,    // radius (base half-size)
  4,    // height
);

const material = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
const pyramid = new THREE.Mesh(geometry, material);

scene.add(pyramid);


let pointLight = new THREE.PointLight(0xffffff, 1, pathWidth, 0)
scene.add(pointLight)
pointLight.position.x = -10;

export const player = new Player(camera, pointLight)

changeState(stateInstances["start"]);

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
        pointLight.position.copy(camera.position)
        //currState.modifyPosition(pointLight.position, newPos);
        //pointLight.distance = 2* getclosestDistance(camera.position, currState.stateBorders)
        // if(currState.axis != null && currState.axis != "all")
        //   pointLight.position[currState.axis] = camera.position[currState.axis]
        // else if(currState.axis != null){
        //   pointLight.position.copy(camera.position)
        // }


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


