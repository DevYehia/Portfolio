import * as THREE from 'three';
import {Sign} from './sign';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export const boundaryCuboidHeight = 8;
export const boundaryCuboidWidth = 50;
export const nearBoundaryCuboidDepth = boundaryCuboidWidth * 2;
export let pathWidth = 25;
const signSpacing = 10;

export let signs = [];




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

export function adjustCamera(camera){
    camera.position.y += boundaryCuboidHeight / 2;
}


/**
 * @param {THREE.Scene} scene
 */
export function addBoundaryCuboids(scene, inputPathWidth){

    pathWidth = inputPathWidth;

    //let nearBoundaryCuboidDepth = boundaryCuboidWidth * 2;

    const nearGeometry = new THREE.BoxGeometry( boundaryCuboidWidth, boundaryCuboidHeight , nearBoundaryCuboidDepth);
    const farGeometry = new THREE.BoxGeometry( boundaryCuboidWidth, boundaryCuboidHeight , boundaryCuboidWidth);
    const material = new THREE.MeshBasicMaterial( { color: 0x0000ff} );

    //near cuboids
    addCuboid(scene, nearGeometry, material, new THREE.Vector3(pathWidth/2 + boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , 0));
    addCuboid(scene, nearGeometry, material, new THREE.Vector3(-pathWidth/2 - boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , 0));
    
    let farCuboidZ = nearBoundaryCuboidDepth/2 + pathWidth + boundaryCuboidWidth / 2;
    
    //far cuboids
    addCuboid(scene, farGeometry, material, new THREE.Vector3(pathWidth/2 + boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , -(farCuboidZ)));
    addCuboid(scene, farGeometry, material, new THREE.Vector3(-pathWidth/2 - boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , -(farCuboidZ)));

}

//signs will be in a square maybe?
export async function addSigns(scene){



    let nearestSignX = -boundaryCuboidWidth - pathWidth / 2 - signSpacing;
    let leftSignsZ =  -nearBoundaryCuboidDepth / 2;

    //place left signs
    let currPos = new THREE.Vector3(nearestSignX, 0, leftSignsZ);
    for(let i = 0 ; i < 3 ; i++){
        let sign = new Sign();
        sign.addToScene(scene);
        signs.push(sign)
        sign.setPosition(currPos);
        currPos.x -= signSpacing;
    }
    let rightSignsZ = leftSignsZ - pathWidth
    currPos = new THREE.Vector3(nearestSignX, 0, rightSignsZ);

    //place right signs
    for(let i = 0 ; i < 3 ; i++){
        let sign = new Sign();
        sign.addToScene(scene);
        signs.push(sign)
        sign.setPosition(currPos);
        currPos.x -= signSpacing;
    }    

    //place central sign
    currPos.z = (leftSignsZ + rightSignsZ) / 2;
    let sign = new Sign();
    sign.addToScene(scene);
    signs.push(sign)
    sign.setPosition(currPos);
    sign.rotateSign()

}

// module.exports = {
//     addBoundaryCuboids
// }

