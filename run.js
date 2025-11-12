import * as THREE from 'three';
import {addBoundaryCuboids, addSigns, adjustCamera} from './environment';
import {animateText} from './textUtils'
import { dialogues } from './dialogues';
import { currState, PlayerData } from './playerStates';
import {Sign} from './sign';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';



let up = new THREE.Vector3(0,1,0);
let right = new THREE.Vector3(1,0,0);

let inPointerLock = false;

let inDialog = true;
let currDialogIdx = 1;
let currDialog = dialogues.start;

let keys = {}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const moveSpeed = 0.3




const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


adjustCamera(camera);

addBoundaryCuboids(scene, 30)
addSigns(scene)

animateText(document.getElementById("talkDiv"), currDialog[0]);

let sign = new Sign(scene);
sign.setPosition(new THREE.Vector3(0,0,0))

let playerData = new PlayerData(camera.position, camera, scene);

//let controls = new PointerLockControls(camera, renderer.domElement)


//const geometry = new TextGeometry( 'Hello three.js!');

// const geometry = new THREE.PlaneGeometry( 100,100 );
// const material = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( geometry, material );

//plane.position.copy(new THREE.Vector3(3,3,3))

// scene.add( plane );
// plane.lookAt(new THREE.Vector3(0,1,0));
//plane.position.y = -boundaryCuboidHeight / 2;

//document.getElementById("talkDiv").hidden = true;


function animate() {

    //movement logic
    if(!inDialog){
        let camLookAt = new THREE.Vector3;
        camera.getWorldDirection(camLookAt);

        //to get perpendicular we cross product with up vector
        //this gives vector to left of look at vector
        let perpendicularToCamLookAt = new THREE.Vector3(0,1,0).cross(camLookAt).normalize();
        //console.log("cam look at is ", camLookAt)
        
        //create a newPos vector, and add to it the movement
        let newPos = new THREE.Vector3().copy(camera.position)
        if(keys['w'] == true){
            newPos.z += camLookAt.z * moveSpeed;
            newPos.x += camLookAt.x * moveSpeed;
        }
        else if(keys['s'] == true){
            newPos.z -= camLookAt.z * moveSpeed;
            newPos.x -= camLookAt.x * moveSpeed
        }

        if(keys['a'] == true){
            newPos.z += perpendicularToCamLookAt.z * moveSpeed;
            newPos.x += perpendicularToCamLookAt.x * moveSpeed;            
        }
        else if(keys['d'] == true){
            newPos.z -= perpendicularToCamLookAt.z * moveSpeed;
            newPos.x -= perpendicularToCamLookAt.x * moveSpeed;              
        }

        //check for collision using newPos
        // if(!currState.checkCollision(newPos)){
        //     //copy change to camera position
        //     camera.position.copy(newPos);
        // }
        currState.modifyPosition(camera.position, newPos);

        //check for next state
        currState.checkAndUpdateState(playerData);

    }



    renderer.render( scene, camera );
  
}


renderer.setAnimationLoop( animate );



//event listeners

document.body.addEventListener('click', () => {
    if(!inDialog)
        renderer.domElement.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  const locked = document.pointerLockElement === renderer.domElement;
  inPointerLock = locked;
  document.getElementById("clickDiv").hidden = locked;
  console.log(locked ? 'Pointer locked!' : 'Pointer released');
});



window.addEventListener('keydown', e => {

    //dialog logic
    if(inDialog && e.key == 'e' && !e.repeat){
        let talkDiv = document.getElementById("talkDiv");
        if(currDialogIdx >= currDialog.length){
            inDialog = false;
            talkDiv.hidden = true;
            
        }
        else{
            animateText(talkDiv, currDialog[currDialogIdx]);
            currDialogIdx++;
        }        
    }    

    //for movement logic
    else{
        keys[e.key] = true;
    }


});
window.addEventListener('keyup', e => {keys[e.key] = false});

const clampMargin = Math.PI / 4;

THREE.Euler.DEFAULT_ORDER
camera.rotation.order = 'YXZ';

window.addEventListener('mousemove', e => {
    if(!inPointerLock){
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


    console.log("Cam up is " + camera.up.x, " , " + camera.up.y + " , " +  camera.up.z)

    
});