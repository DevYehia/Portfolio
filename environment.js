import * as THREE from 'three';
import {Sign} from './sign';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Door } from './door';
import { projectsData } from './projects';
import { ProjectsRoom } from './Rooms/projectsRoom';

export const boundaryCuboidHeight = 8;
export const boundaryCuboidWidth = 50;
export const nearBoundaryCuboidDepth = boundaryCuboidWidth * 2;
export let pathWidth = 25;
const signSpacing = 10;

//export let signs = [];
//export let projectsRoomDoor = null;

export let projectsRoomGroup = null;
//export let projectRoomLight = null;
export let projectsRoom = null;





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
function addSigns(group, roomWidth){

    let signs = []
    let projectKeys = Object.keys(projectsData); 
    let currProjectKeyIdx = 0;
    let currProjectKey = projectKeys[currProjectKeyIdx];
    //place left signs
    let currPos = new THREE.Vector3(-signSpacing, 0, 0);
    for(let i = 0 ; i < 3 ; i++){
        let sign = new Sign(currProjectKey, projectsData[currProjectKey].imagePath, projectsData[currProjectKey].name);
        sign.addToGroup(group)
        signs.push(sign)
        sign.setPosition(currPos);
        currPos.x -= signSpacing;
        currProjectKeyIdx = (currProjectKeyIdx + 1) % projectKeys.length;
        currProjectKey = projectKeys[currProjectKeyIdx]
    }
    let rightSignsZ = -roomWidth
    currPos = new THREE.Vector3(-signSpacing, 0, rightSignsZ);

    //place right signs
    for(let i = 0 ; i < 3 ; i++){
        let sign = new Sign(currProjectKey, projectsData[currProjectKey].imagePath, projectsData[currProjectKey].name);
        sign.addToGroup(group);
        signs.push(sign)
        sign.setPosition(currPos);
        currPos.x -= signSpacing;
        currProjectKeyIdx = (currProjectKeyIdx + 1) % projectKeys.length;
        currProjectKey = projectKeys[currProjectKeyIdx]
    }    

    //place central sign
    currPos.z = -roomWidth / 2;
    let sign = new Sign(currProjectKey, projectsData[currProjectKey].imagePath, projectsData[currProjectKey].name);
    sign.addToGroup(group);
    signs.push(sign)
    sign.setPosition(currPos);
    sign.rotateSign()

    return signs

}


export function addProjectsRoom(scene){
    const projectsRoomGroup = new THREE.Group()
    let signList = addSigns(projectsRoomGroup, pathWidth);

    projectsRoom = new ProjectsRoom(signList, projectsRoomGroup, pathWidth)



    scene.add(projectsRoomGroup);
    

    let roomX = -(pathWidth / 2 + boundaryCuboidWidth);
    let roomY = 0;
    let roomZ = -nearBoundaryCuboidDepth / 2; 


    projectsRoomGroup.position.set(roomX, roomY, roomZ);
}

// module.exports = {
//     addBoundaryCuboids
// }

