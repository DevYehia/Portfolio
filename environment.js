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
import { loadTexture } from './Utils/sceneUtils';

//configs
export const boundaryCuboidHeight = 12;
export const boundaryCuboidWidth = 60;
export const nearBoundaryCuboidDepth = boundaryCuboidWidth * 2;
export let pathWidth = 30;
export let stars;

//central environment objects collection
export const envStuff = {}; 

/**
 * @type {ProjectsRoom}
 */

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


export let ambLight = new THREE.AmbientLight(0xffffff, 0);





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

    let nearWidthTexture = loadTexture("textures/env/stone.jpeg", nearBoundaryCuboidDepth, boundaryCuboidHeight, 3)
    let depthTexture = loadTexture("textures/env/stone.jpeg", boundaryCuboidWidth, boundaryCuboidHeight, 3)


    const nearGeometry = new THREE.BoxGeometry( boundaryCuboidWidth, boundaryCuboidHeight , nearBoundaryCuboidDepth);
    const farGeometry = new THREE.BoxGeometry( boundaryCuboidWidth, boundaryCuboidHeight , boundaryCuboidWidth);
    const depthMat = new THREE.MeshStandardMaterial( { map: depthTexture} );
    const nearMat = new THREE.MeshStandardMaterial( { map: nearWidthTexture} );

    //order is right, left, top, bottom, front ,back
    let matList = [nearMat, nearMat, null, null, depthMat, depthMat]

    //near cuboids
    addCuboid(scene, nearGeometry, matList, new THREE.Vector3(pathWidth/2 + boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , 0));
    addCuboid(scene, nearGeometry, matList, new THREE.Vector3(-pathWidth/2 - boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , 0));
    
    let farCuboidZ = nearBoundaryCuboidDepth/2 + pathWidth + boundaryCuboidWidth / 2;
    
    //far cuboids
    addCuboid(scene, farGeometry, depthMat, new THREE.Vector3(pathWidth/2 + boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , -(farCuboidZ)));
    addCuboid(scene, farGeometry, depthMat, new THREE.Vector3(-pathWidth/2 - boundaryCuboidWidth/2, boundaryCuboidHeight / 2 , -(farCuboidZ)));

}



export function addProjectsRoom(scene){

    projectsRoom = new ProjectsRoom({
        width: pathWidth + 20,
        height: boundaryCuboidHeight + 20}
    )

    projectsRoom.rotateY(Math.PI / 2)


    scene.add(projectsRoom);

    let roomX = -(pathWidth / 2 + boundaryCuboidWidth);
    let roomY = 0;
    let roomZ = -nearBoundaryCuboidDepth / 2 + 10; 


    projectsRoom.position.set(roomX, roomY, roomZ);
    projectsRoom.door.sign = -1;
    
    //set up envStuff
    envStuff["projectsRoom"] = {}
    let projectsEnv = envStuff["projectsRoom"]
    projectsEnv["door"] = projectsRoom.door
    projectsEnv["cert"] = projectsRoom.certificate
    projectsRoom["signs"] = projectsRoom.signsList

}

export function addHOFRoom(scene){

    let boardOffset = 20;

    hallOfFameRoom = new HOFRoom(boardOffset, 50, friends);


    scene.add(hallOfFameRoom);

    hallOfFameRoom.rotateY(-Math.PI / 2)
    

    let roomX = pathWidth / 2 + boundaryCuboidWidth;
    let roomY = 0;
    let roomZ = -nearBoundaryCuboidDepth / 2 - pathWidth / 2 - hallOfFameRoom.width / 2; 


    hallOfFameRoom.position.set(roomX, roomY, roomZ);

    //set up envStuff
    envStuff["HOFRoom"] = {}
    let HOFEnv = envStuff["HOFRoom"]
    HOFEnv["door"] = hallOfFameRoom.door
    HOFEnv["cert"] = hallOfFameRoom.certificate
    HOFEnv["friends"] = hallOfFameRoom.board.imageList 
}

export function addMyRoom(scene){

    let roomWidth = pathWidth + 20;

    let roomPos = new THREE.Vector3()

    myRoom = new MyRoom(roomWidth, 30, 50, roomPos);


    scene.add(myRoom)

    let roomX = -myRoom.width / 2;
    let roomY = 0;
    let roomZ = -(nearBoundaryCuboidDepth / 2 + pathWidth + boundaryCuboidWidth);
    
    myRoom.position.set(roomX, roomY, roomZ)

    myRoom.updateClippingPlanes()

    //set up envStuff
    envStuff["myRoom"] = {}
    let myRoomEnv = envStuff["myRoom"]
    myRoomEnv["door"] = myRoom.door
    myRoomEnv["cert"] = myRoom.certificate
    myRoomEnv["profiles"] = myRoom.signsList
    myRoomEnv["timeline"] = myRoom.timeLineBoard
    myRoomEnv["skills"] = myRoom.skillsBoardGroup  
}


export function addStars(scene){


    //consturct vertices
    let vertices = [];

    for(let i = 0 ; i < 1500 ; i++){
        vertices.push((Math.random() * 3000) - 1000 , 300 , (Math.random() * 3000) - 2000);
    }

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


export function addAmbientLight(scene){
    scene.add(ambLight)
}



export function addGround(scene){
    let groundTexture = new THREE.TextureLoader().load("textures/env/grass.avif")
    groundTexture.colorSpace = THREE.SRGBColorSpace
    groundTexture.wrapS = THREE.RepeatWrapping
    groundTexture.wrapT = THREE.RepeatWrapping

    groundTexture.repeat.set(24,24)

    let groundWidth = 2 * boundaryCuboidWidth + pathWidth
    let groundHeight = nearBoundaryCuboidDepth + boundaryCuboidWidth + pathWidth

    let groundGeo = new THREE.PlaneGeometry(groundWidth, groundHeight)
    let groundMat = new THREE.MeshStandardMaterial({map: groundTexture, side: THREE.DoubleSide})

    let ground = new THREE.Mesh(groundGeo, groundMat)

    //adjust its position
    ground.rotateX(-Math.PI / 2)
    ground.position.set(0, 0, -groundHeight / 2 + nearBoundaryCuboidDepth / 2)

    scene.add(ground)


}
// module.exports = {
//     addBoundaryCuboids
// }

