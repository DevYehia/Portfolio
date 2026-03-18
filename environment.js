import * as THREE from 'three';
import { ProjectsRoom } from './Rooms/projectsRoom';
import { HOFRoom } from './Rooms/HOFRoom';
import { MyRoom } from './Rooms/MyRoom';
import { getTextGeoSize, loadTexture } from './Utils/sceneUtils';
import { Collectible } from './Objects/collectible';
import { certificates } from './Data/certificates';
import { makeControls } from './Utils/textUtils';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { HOFTitlefont } from './loader';
import { envStuff } from './WorldObjects';
import { Interaction } from './Objects/interactable';

//configs
export let pathWidth = 25;
export const boundaryCuboidHeight = 12;
export const boundaryCuboidWidth = 60;
export const nearBoundaryCuboidDepth = boundaryCuboidWidth * 1.5;
export let stars;



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

export let finalCertificate;



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

//adjusts height and light
export function adjustPlayer(player){
    player.position.y += boundaryCuboidHeight / 2;
    player.light.distance = pathWidth
}


/**
 * @param {THREE.Scene} scene
 */
export function addBoundaryCuboids(scene){

    let nearWidthTexture = loadTexture("textures/env/stone.jpeg", nearBoundaryCuboidDepth, boundaryCuboidHeight, 3)
    let depthTexture = loadTexture("textures/env/stone.jpeg", boundaryCuboidWidth, boundaryCuboidHeight, 3)


    const nearGeometry = new THREE.BoxGeometry( boundaryCuboidWidth, boundaryCuboidHeight , nearBoundaryCuboidDepth);
    const farGeometry = new THREE.BoxGeometry( boundaryCuboidWidth, boundaryCuboidHeight , boundaryCuboidWidth);
    const depthMat = new THREE.MeshStandardMaterial( { map: depthTexture} );
    const nearMat = new THREE.MeshStandardMaterial( { map: nearWidthTexture} );

    //order is right, left, top, bottom, front ,back
    let matList = [nearMat, nearMat, null, null, depthMat, depthMat]

    let rightPosX = pathWidth/2 + boundaryCuboidWidth/2
    let leftPosX = -rightPosX

    //near cuboids
    addCuboid(scene, nearGeometry, matList, new THREE.Vector3(rightPosX, boundaryCuboidHeight / 2 , 0));
    addCuboid(scene, nearGeometry, matList, new THREE.Vector3(leftPosX, boundaryCuboidHeight / 2 , 0));
    
    let farCuboidZ = -(nearBoundaryCuboidDepth/2 + pathWidth + boundaryCuboidWidth / 2);
    
    //far cuboids
    addCuboid(scene, farGeometry, depthMat, new THREE.Vector3(rightPosX, boundaryCuboidHeight / 2 , farCuboidZ));
    addCuboid(scene, farGeometry, depthMat, new THREE.Vector3(leftPosX, boundaryCuboidHeight / 2 , farCuboidZ));

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
    projectsEnv["signs"] = projectsRoom.signsList

}

export function addHOFRoom(scene){

    let boardOffset = 20;

    hallOfFameRoom = new HOFRoom(boardOffset, 50);


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

/**
 * 
 * @param {THREE.Scene} scene 
 */
//puts last certificate and wall
export function addFinalPart(scene){
    let certZ = nearBoundaryCuboidDepth / 2 - 5;
    let certY = 0.1


    let finalCertID = "Grad";

    let cert = new Collectible({
        width: 4,
        height: 2,
        padding: 5,
        image: "../textures/Certificates/" + certificates[finalCertID].image.lowRes
    })
    envStuff["finalCertificate"] = cert;
    cert.position.set(0, certY, certZ)
    cert.rotateY(Math.PI)


    // cert.interactions['e'] = () => {
    //     onCollectLastCertificate(scene)
    // }
    cert.interactions.push(new Interaction("CERT", [finalCertID, scene, cert]))

    //cert.visible = false
    scene.add(cert)


    //wall
    let wall = new THREE.Mesh(
        new THREE.PlaneGeometry(pathWidth, boundaryCuboidHeight),
        new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: 0x000000
        })
    )

    scene.add(wall)
    wall.position.set(0, boundaryCuboidHeight / 2, nearBoundaryCuboidDepth / 2) //+ve z yay

    envStuff["thanksWall"] = wall

}




export function addThanksMessage(scene, playerName){

    const messageDepth = 0.5
    const messageSize = 3

    let thanksMessage = new THREE.Mesh(
        new TextGeometry("THANK YOU", {size: messageSize, font: HOFTitlefont, depth: messageDepth}),
        new THREE.MeshStandardMaterial(
            {color: 0x0000ff}
        )
    )

    let playerNameText = new THREE.Mesh(
        new TextGeometry(playerName, {size: messageSize, font: HOFTitlefont, depth: messageDepth}),
        new THREE.MeshStandardMaterial(
            {color: 0x7f00ff
            }
        )
    )

    let thanksSize = getTextGeoSize(thanksMessage)
    let nameSize = getTextGeoSize(playerNameText)


    //set positions
    thanksMessage.position.set( 
        thanksSize.x / 2,
        boundaryCuboidHeight * 2 / 3 - thanksSize.y / 2,
        nearBoundaryCuboidDepth / 2 - messageDepth
    )
    playerNameText.position.set(
        nameSize.x / 2,
        boundaryCuboidHeight  / 3 - nameSize.y / 2, 
        nearBoundaryCuboidDepth / 2 - messageDepth
    )

    //set rotations
    thanksMessage.rotateY(Math.PI)
    playerNameText.rotateY(Math.PI)

    scene.add(thanksMessage, playerNameText)

    
}
