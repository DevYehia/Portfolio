import * as THREE from 'three';
import {addAmbientLight, addBoundaryCuboids, addHOFRoom, addMyRoom, addProjectsRoom,  addStars,  adjustCamera} from './environment';
import {animateText} from './Utils/textUtils'
import { dialogues } from './Data/dialogues';
import { PlayerData, changeState, currState } from './PlayerStates/common';
import { StartState } from './PlayerStates/startState';
import {Sign} from './Objects/sign';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Door } from './Objects/door'
import { KeyStates, keys, initKeyboardUtils, processKeyboardInput, resetKeys } from './Utils/keyboardUtils';
import { CSS3DRenderer } from 'three/examples/jsm/Addons.js';
import { setupPauseMenu } from './pauseMenu';
import { loadStuff } from './loader';
import { Torch } from './Objects/torch';
import { Collectible } from './Objects/collectible';

import { gsap } from 'gsap/gsap-core';




let optionsMenuDiv = document.getElementById("menuButton")


let inPointerLock = false;



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const moveSpeed = 20



const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.localClippingEnabled = true;

await loadStuff()

initKeyboardUtils()
setupPauseMenu()

//important to start game
changeState(new StartState());


adjustCamera(camera);

addBoundaryCuboids(scene, 30)
//addSigns(scene)

let sign = new Sign(scene);
sign.setPosition(new THREE.Vector3(0,0,0))

let playerData = new PlayerData(camera.position, camera, scene, keys);


// addDoor(scene)
addProjectsRoom(scene)
addHOFRoom(scene)
addMyRoom(scene)
addStars(scene)
addAmbientLight(scene)

let coll = new Collectible();
coll.position.z -= 10
coll.rotateY(-Math.PI / 2)
scene.add(coll)

const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 5);

let testMat = new THREE.MeshBasicMaterial({color: 0xff0000})
let geo = new THREE.DodecahedronGeometry(8, 0);

let mesh = new THREE.Mesh(geo, testMat);

scene.add(mesh)
//mesh.position.y = camera.position.y

let torch = new Torch();
//scene.add(torch)

let pointLight = new THREE.PointLight(0xFFFFFF, 100, 0)
//scene.add(pointLight)

 //let ambLight = new THREE.AmbientLight(0xffffff, 0.1)
 //scene.add(ambLight)

pointLight.position.copy(camera.position)


const clock = new THREE.Clock();

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff5500 })
);
//scene.add(sphere);


function animate() {


  //particles.rotation.y += 0.001;
 //sphere.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(Date.now() * 0.005);
 // console.log("In state " + JSON.stringify(currState))
    const pos = coll.particles.geometry.attributes.position.array;

    for(let i = 1 ; i < pos.length ; i+=3){
      pos[i] += 0.01
      if(pos[i] > 3){
        pos[i] = 0;
      }
    }
    coll.particles.geometry.attributes.position.needsUpdate = true;


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


