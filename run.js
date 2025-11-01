import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const boundaryCuboidHeight = 5;
const boundaryCuboidWidth = 30;


/**
 * @param {THREE.Scene} scene
 * @param {THREE.BoxGeometry} geometry
 * @param {THREE.MeshBasicMaterial} material
 * @param {THREE.Vector3} position
 */
function addCuboid(scene, geometry, material, position){
    const cuboid = new THREE.Mesh( geometry, material );
    scene.add(cuboid);
    cuboid.position.copy(position)
}



/**
 * @param {THREE.Scene} scene
 */
function addBoundaryCuboids(scene, pathWidth){

    const geometry = new THREE.BoxGeometry( boundaryCuboidWidth, boundaryCuboidHeight , boundaryCuboidWidth);
    const material = new THREE.MeshBasicMaterial( { color: 0x0000ff} );

    addCuboid(scene, geometry, material, new THREE.Vector3(pathWidth/2 + boundaryCuboidWidth/2, 0 , 0));
    addCuboid(scene, geometry, material, new THREE.Vector3(-pathWidth/2 - boundaryCuboidWidth/2, 0 , 0));    
    addCuboid(scene, geometry, material, new THREE.Vector3(pathWidth/2 + boundaryCuboidWidth/2, 0 , -100));
    addCuboid(scene, geometry, material, new THREE.Vector3(-pathWidth/2 - boundaryCuboidWidth/2, 0 , -100));

}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const moveSpeed = 1

let inPointerLock = false;


document.body.addEventListener('click', () => {
  renderer.domElement.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  const locked = document.pointerLockElement === renderer.domElement;
  inPointerLock = locked;
  console.log(locked ? 'Pointer locked!' : 'Pointer released');
});

window.addEventListener('keydown', e => {
    if(e.key == 'w'){
        console.log("ello");
        
        let camLookAt = new THREE.Vector3;
        camera.getWorldDirection(camLookAt);
        console.log("cam look at is ", camLookAt)
        camera.position.z += camLookAt.z;
        camera.position.x += camLookAt.x
    }
    else if(e.key == 's'){camera.position.z += moveSpeed}});

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


const geometry = new THREE.PlaneGeometry( 100,100 );
const material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );

scene.add( plane );
plane.lookAt(new THREE.Vector3(0,1,0));
plane.position.y = -boundaryCuboidHeight / 2;


function animate() {



  renderer.render( scene, camera );
  
}


renderer.setAnimationLoop( animate );