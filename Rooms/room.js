import * as THREE from 'three'
import {Door} from '../Objects/door'

export class Room extends THREE.Object3D{

    //the door to enter the room
    /**
     * @type {Door}
     */
    door = new Door();

    //the ambient light of the room
    /**
     * @type {THREE.AmbientLight}
     */    
    ambLight = new THREE.AmbientLight(0xffffff, 0);



    constructor(startIntensity, roomWidth){
        super()
        this.ambLight.intensity = startIntensity
        this.roomWidth = roomWidth
        this.add(this.ambLight);
        this.addDoor()

    }

    addDoor(){
        let doorX = 0;
        let doorY = 0;
        let doorZ = - (this.roomWidth / 2 - this.door.doorWidth / 2)
        this.door.doorMesh.rotation.y += Math.PI / 2;
        this.door.doorMesh.position.copy(new THREE.Vector3(doorX, doorY, doorZ))
        this.door.doorMesh.name = "door";
        this.add(this.door.doorMesh)
    }

    //didn't make it in constructor as room depth is sometimes calculated dynamically
    addWalls(roomWidth, roomHeight, roomDepth){


        const frontWallGeo = new THREE.PlaneGeometry((roomWidth - this.door.doorWidth) / 2, roomHeight);
        let frontWallMat = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
        let wallMat = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide})

        const backWallGeo = new THREE.PlaneGeometry(roomWidth, roomHeight);
        const sideWallGeo = new THREE.PlaneGeometry(roomDepth, roomHeight);

        this.wallGroup = new THREE.Group();

        //add wall meshes
        let frontWallLeftPart = new THREE.Mesh(frontWallGeo, frontWallMat);
        let frontWallRightPart = new THREE.Mesh(frontWallGeo, frontWallMat);
        let rightWall = new THREE.Mesh(sideWallGeo, wallMat);
        let leftWall = new THREE.Mesh(sideWallGeo, wallMat);        
        let backWall = new THREE.Mesh(backWallGeo, wallMat);

        //add wall positions add rotations
        //frontWallRightPart.position.set(roomWidth / 2 + this.door.doorWidth, roomHeight / 2, 0);
        frontWallRightPart.position.set()

        rightWall.rotateY(Math.PI / 2);
        rightWall.position.set(roomWidth, roomHeight / 2 , -roomDepth / 2)

        leftWall.rotateY(Math.PI / 2);
        leftWall.position.set(0, roomHeight / 2 , -roomDepth / 2)

        backWall.position.z -= roomDepth

        this.wallGroup.add(frontWallRightPart, frontWallLeftPart, rightWall, leftWall, backWall);
        //this.wallGroup.position.set(roomWidth / 2, 0, roomDepth / 2)
        this.add(this.wallGroup);


    }
    
}