import * as THREE from 'three';
import {addBoundaryCuboids} from './environment';
import {animateText} from './textUtils'
import { dialogues } from './dialogues';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const moveSpeed = 1

let inPointerLock = false;

let inDialog = true;
let currDialogIdx = 1;
let currDialog = dialogues.start;


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

window.addEventListener('keypress', e => {
    
    let camLookAt = new THREE.Vector3;
    let talkDiv = document.getElementById("talkDiv");
    camera.getWorldDirection(camLookAt);
    console.log("cam look at is ", camLookAt)
    if(!inDialog && e.key == 'w'){

        console.log("ello");

        camera.position.z += camLookAt.z;
        camera.position.x += camLookAt.x
    }
    else if(!inDialog && e.key == 's'){
        camera.position.z -= camLookAt.z
        camera.position.x -= camLookAt.x
    }
    else if(inDialog && e.key == 'e'){
        if(currDialogIdx >= currDialog.length){
            inDialog = false;
            talkDiv.hidden = true;
        }
        animateText(talkDiv, currDialog[currDialogIdx]);
        currDialogIdx++;

    }});

window.addEventListener('mousemove', e => {
    if(!inPointerLock){
        return;
    }
    if(e.movementX != 0){
        camera.rotateY(-e.movementX * 0.002)
    }
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

addBoundaryCuboids(scene, 10)

animateText(document.getElementById("talkDiv"), currDialog[0]);


// const geometry = new THREE.PlaneGeometry( 100,100 );
// const material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( geometry, material );

// scene.add( plane );
// plane.lookAt(new THREE.Vector3(0,1,0));
// //plane.position.y = -boundaryCuboidHeight / 2;

//document.getElementById("talkDiv").hidden = true;

console.log(1/2)

function animate() {



  renderer.render( scene, camera );
  
}


renderer.setAnimationLoop( animate );