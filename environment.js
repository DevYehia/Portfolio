import * as THREE from 'three';
import {Sign} from './Objects/sign';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Door } from './Objects/door';
import { projectsData } from './projects';
import { ProjectsRoom } from './Rooms/projectsRoom';
import { HOFRoom } from './Rooms/HOFRoom';
import { friends } from './friends';

export const boundaryCuboidHeight = 8;
export const boundaryCuboidWidth = 50;
export const nearBoundaryCuboidDepth = boundaryCuboidWidth * 2;
export let pathWidth = 25;

export let projectsRoom = null;

/**
 * @type {HOFRoom}
 */
export let hallOfFameRoom = null;





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



export function addProjectsRoom(scene){

    projectsRoom = new ProjectsRoom(pathWidth)

    projectsRoom.addWalls(pathWidth + 5, boundaryCuboidHeight, 50);
    //scene.add(projectsRoom.wallGroup)

    projectsRoom.wallGroup.rotateY(Math.PI / 2)


    scene.add(projectsRoom);
    console.log(JSON.stringify(projectsRoom))

    let roomX = -(pathWidth / 2 + boundaryCuboidWidth);
    let roomY = 0;
    let roomZ = -nearBoundaryCuboidDepth / 2; 


    projectsRoom.position.set(roomX, roomY, roomZ);
}

export function addHOFRoom(scene){
    hallOfFameRoom = new HOFRoom(pathWidth, friends);

    scene.add(hallOfFameRoom);
    

    let roomX = pathWidth / 2 + boundaryCuboidWidth;
    let roomY = 0;
    let roomZ = -nearBoundaryCuboidDepth / 2; 


    hallOfFameRoom.position.set(roomX, roomY, roomZ);
    let doorTest = new THREE.Vector3();
    //console.log("door at " + JSON.stringify(hallOfFameRoom.door.doorMesh.getWorldPosition(doorTest)))
}

// module.exports = {
//     addBoundaryCuboids
// }

