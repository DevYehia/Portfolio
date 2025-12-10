import * as THREE from 'three';
import {Sign} from './Objects/sign';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Door } from './Objects/door';
import { projectsData } from './Data/projects';
import { ProjectsRoom } from './Rooms/projectsRoom';
import { HOFRoom } from './Rooms/HOFRoom';
import { friends } from './Data/friends';
import { MyRoom } from './Rooms/MyRoom';


export const boundaryCuboidHeight = 12;
export const boundaryCuboidWidth = 50;
export const nearBoundaryCuboidDepth = boundaryCuboidWidth * 2;
export let pathWidth = 25;
export let stars;

export let projectsRoom = null;

/**
 * @type {HOFRoom}
 */
export let hallOfFameRoom = null;

/**
 * @type {MyRoom}
 */

export let myRoom = null;

/**
 * @type {TheaterRoom}
 */

export let theaterRoom = null;





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
    const material = new THREE.MeshStandardMaterial( { color: 0x0000ff} );

    //near cuboids
    addCuboid(scene, nearGeometry, material, new THREE.Vector3(pathWidth/2 + boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , 0));
    addCuboid(scene, nearGeometry, material, new THREE.Vector3(-pathWidth/2 - boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , 0));
    
    let farCuboidZ = nearBoundaryCuboidDepth/2 + pathWidth + boundaryCuboidWidth / 2;
    
    //far cuboids
    addCuboid(scene, farGeometry, material, new THREE.Vector3(pathWidth/2 + boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , -(farCuboidZ)));
    addCuboid(scene, farGeometry, material, new THREE.Vector3(-pathWidth/2 - boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , -(farCuboidZ)));

}



export function addProjectsRoom(scene){

    projectsRoom = new ProjectsRoom(pathWidth + 20)

    const box = new THREE.Box3().setFromObject(projectsRoom);
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log(JSON.stringify(size))
    projectsRoom.addWalls(pathWidth + 20, boundaryCuboidHeight + 20, size.z + 10);
    //scene.add(projectsRoom.wallGroup)

    projectsRoom.rotateY(Math.PI / 2)


    scene.add(projectsRoom);

    let roomX = -(pathWidth / 2 + boundaryCuboidWidth);
    let roomY = 0;
    let roomZ = -nearBoundaryCuboidDepth / 2 + 10; 


    projectsRoom.position.set(roomX, roomY, roomZ);
}

export function addHOFRoom(scene){
    hallOfFameRoom = new HOFRoom(pathWidth, friends);

    scene.add(hallOfFameRoom);

    hallOfFameRoom.rotateY(-Math.PI / 2)
    

    let roomX = pathWidth / 2 + boundaryCuboidWidth;
    let roomY = 0;
    let roomZ = -nearBoundaryCuboidDepth / 2 - pathWidth - 20; 


    hallOfFameRoom.position.set(roomX, roomY, roomZ);

    
    //console.log("door at " + JSON.stringify(hallOfFameRoom.door.doorMesh.getWorldPosition(doorTest)))
}

export function addMyRoom(scene){

    let roomX = - pathWidth / 2;
    let roomY = 0;
    let roomZ = -(nearBoundaryCuboidDepth / 2 + pathWidth + boundaryCuboidWidth);

    let roomPos = new THREE.Vector3(roomX, roomY, roomZ);

    myRoom = new MyRoom(pathWidth, roomPos);


    scene.add(myRoom)
    
    myRoom.position.set(roomX, roomY, roomZ)
}


export function addStars(scene){


    //consturct vertices
    let vertices = [];

    for(let i = 0 ; i < 1500 ; i++){
        vertices.push((Math.random() * 3000) - 500 , 300 , (Math.random() * 3000) - 2000);
    }

    console.log(vertices)

    //scene.add(mesh)
    const particles = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position',
        new THREE.Float32BufferAttribute(
        vertices, 3
        )
    ),
    new THREE.PointsMaterial({ color: 0xffffff, size: 1 })
    );
    scene.add(particles);
    stars = particles
}

// module.exports = {
//     addBoundaryCuboids
// }

