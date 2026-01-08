import * as THREE from 'three'
import {Door} from '../Objects/door'
import { MeshPhongMaterial, PlaneGeometry, Vector3 } from 'three/webgpu';
import { handleInteraction } from '../Utils/interactionsUtils';
import { Collectible } from '../Objects/collectible';
import { certificates } from '../Data/certificates';
export class Room extends THREE.Object3D{

    //the door to enter the room
    /**
     * @type {Door}
     */
    door = new Door(true);

    width;

    height;

    depth;

    roomLight = new THREE.PointLight(0xffffff, 1, 0, 0)


    constructor({
        width = null,
        height = null,
        depth = null
    } = {}){
        super()
        this.width = width;
        this.height = height;
        this.depth = depth;

        console.log("In Room Const " + width, " " + height , " " + depth)

        //if width is predefined
        if(width != null)
            this.addDoor()

    }

    setDims(width, height, depth){
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    addDoor(){
        let doorX = (this.width / 2 - this.door.doorWidth / 2);
        let doorY = 0;
        let doorZ = 0;
        this.door.position.copy(new THREE.Vector3(doorX, doorY, doorZ))
        this.door.name = "door";
        this.door.interactions['e'] = (() => {handleInteraction(this.door, "DOOR")}).bind(this)
        this.add(this.door)
    }

    addCollectible(certID){
        this.certificate = new Collectible({
            width: 4,
            height: 2,
            padding: 5,
            particlesColor: 0x000000,
            image: "../textures/Certificates/" + certificates[certID].image
        });
        this.add(this.certificate)

        //put it at random position in the room
        this.certificate.position.x = this.width / 2;
        this.certificate.position.z = - this.depth * 3 / 4
        this.certificate.position.y += 0.1       
        
        this.certificate.controls = "Certificate<br>E - Collect"

        this.certificate.interactions['e'] = () => {
            certificates[certID].collected = true;
            this.remove(this.certificate)
        }

    }


    getRoomDims(){
        let box = new THREE.Box3();
        let roomDims = new THREE.Vector3();
        box.setFromObject(this).getSize(roomDims);
        return roomDims;
    }

    addLight(){

        //top of the room
        this.roomLight.position.set(
            this.width / 2,
            this.height / 2,
            -this.depth / 2
        )

        this.roomLight.distance = this.depth
        this.add(this.roomLight)
    }

    //didn't make it in constructor as room depth is sometimes calculated dynamically
    addWalls(texturePath, wallColor){

        let roomWidth = this.width
        let roomHeight = this.height;
        let roomDepth = this.depth

        console.log("In Add Walls  " + roomWidth, " " + roomHeight , " " + roomDepth)

        const backWallGeo = new THREE.PlaneGeometry(roomWidth, roomHeight);
        const sideWallGeo = new THREE.PlaneGeometry(roomDepth, roomHeight);
        const roofGeo = new THREE.PlaneGeometry(roomWidth, roomDepth)

        //wall texture
        const WallTexture = new THREE.TextureLoader().load(texturePath)
        WallTexture.wrapS = THREE.RepeatWrapping;
        WallTexture.wrapT = THREE.RepeatWrapping;
        let rep = 2
        WallTexture.repeat.set(rep * (Math.ceil(this.width / this.height)),rep)
        WallTexture.colorSpace = THREE.SRGBColorSpace

        let sideWallTexture = WallTexture.clone()
        sideWallTexture.repeat.set(rep * (Math.ceil(this.depth / this.height)), rep)
        let sideWallMat = new THREE.MeshStandardMaterial({color: wallColor, side: THREE.DoubleSide, map: sideWallTexture})
        
        //ceiling texture
        const ceilTexture = new THREE.TextureLoader().load("textures/Wall.jpg")
        ceilTexture.wrapS = THREE.RepeatWrapping;
        ceilTexture.wrapT = THREE.RepeatWrapping;
        rep = 3
        ceilTexture.repeat.set(rep * (Math.ceil(this.width / this.depth)),rep)
        ceilTexture.colorSpace = THREE.SRGBColorSpace

        let wallMat = new THREE.MeshStandardMaterial({color: wallColor, side: THREE.DoubleSide, map: WallTexture})
        let roofMat = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide, map: ceilTexture})
        
        this.wallGroup = new THREE.Group();

        let frontWall = this.addFrontWall(roomWidth, roomHeight, wallColor);
        let rightWall = new THREE.Mesh(sideWallGeo, sideWallMat);
        let leftWall = new THREE.Mesh(sideWallGeo, sideWallMat);        
        let backWall = new THREE.Mesh(backWallGeo, wallMat);
        let roof = new THREE.Mesh(roofGeo, roofMat);



        //walls will be positioned around the origin of the group at the bottom left corner of da room

        //this wall is the only wall that has its origin at bottom left because it is made from a shape

        //set-up walls position
        rightWall.rotateY(Math.PI / 2);
        rightWall.position.set(roomWidth, roomHeight / 2 , -roomDepth / 2)

        leftWall.rotateY(Math.PI / 2);
        leftWall.position.set(0, roomHeight / 2 , -roomDepth / 2)

        backWall.position.set( roomWidth / 2,  roomHeight / 2, -roomDepth);

        roof.rotateX(Math.PI / 2)
        roof.position.set(roomWidth / 2, roomHeight, -roomDepth / 2);

        this.wallGroup.add(frontWall, rightWall, leftWall, backWall, roof)


        this.add(this.wallGroup);


    }

    addFloor(floorTexturePath, rep = 4){
        const floorGeo = new PlaneGeometry(this.width, this.depth);
        let floorTexture = new THREE.TextureLoader().load(floorTexturePath)

        floorTexture.colorSpace = THREE.SRGBColorSpace;
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;

        floorTexture.repeat.set(rep * (this.width / this.depth), rep)


        const floorMat = new THREE.MeshPhongMaterial({map: floorTexture, side: THREE.DoubleSide});

        const floorMesh = new THREE.Mesh(floorGeo, floorMat);

        floorMesh.rotateX(Math.PI / 2);
        floorMesh.position.set(this.width / 2, 0, -this.depth / 2);

        this.add(floorMesh)
    }

    addFrontWall(roomWidth, roomHeight, wallColor){


        //no textures for front wall
        //I am tired of trying to make it work



        //three planes approach
        let sideWidth = (roomWidth - this.door.doorWidth) / 2
        let topHeight = roomHeight - this.door.doorHeight
        let sidePlanesGeo = new THREE.BoxGeometry(sideWidth, roomHeight, 0.2)
        let topPlaneGeo = new THREE.BoxGeometry(this.door.doorWidth, topHeight, 0.2)

        let frontWallMat = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, color: wallColor})
        let topWallMat = new THREE.MeshPhongMaterial({color: wallColor, side: THREE.DoubleSide})

        //left mesh
        let leftMesh = new THREE.Mesh(sidePlanesGeo, frontWallMat)
        leftMesh.position.x += sideWidth / 2;
        leftMesh.position.y += roomHeight / 2;
        //right mesh
        let rightMesh = new THREE.Mesh(sidePlanesGeo, frontWallMat)
        rightMesh.position.x += roomWidth - sideWidth / 2;
        rightMesh.position.y += roomHeight / 2

        //top mesh
        let topMesh = new THREE.Mesh(topPlaneGeo, topWallMat)
        topMesh.position.y += this.door.doorHeight + topHeight / 2;
        topMesh.position.x += roomWidth / 2

        let elGroup = new THREE.Group()
        elGroup.add(rightMesh, leftMesh, topMesh)

        return elGroup
    }


    setDepth(){
        const box = new THREE.Box3().setFromObject(this);
        const size = new THREE.Vector3();
        box.getSize(size);   
        this.depth = size.z;     
    }
    
}