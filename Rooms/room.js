import * as THREE from 'three'
import {Door} from '../Objects/door'
import { MeshPhongMaterial, PlaneGeometry, Vector3 } from 'three/webgpu';
import { handleInteraction } from '../Utils/interactionsUtils';

export class Room extends THREE.Object3D{

    //the door to enter the room
    /**
     * @type {Door}
     */
    door = new Door(true);

    width;

    height;

    depth;

    roomLight = new THREE.PointLight(0xffffff, 1000)


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
    addWalls(){

        let roomWidth = this.width
        let roomHeight = this.height;
        let roomDepth = this.depth

        console.log("In Add Walls  " + roomWidth, " " + roomHeight , " " + roomDepth)

        const backWallGeo = new THREE.PlaneGeometry(roomWidth, roomHeight);
        const sideWallGeo = new THREE.PlaneGeometry(roomDepth, roomHeight);
        const roofGeo = new THREE.PlaneGeometry(roomWidth, roomDepth)
        const WallTexture = new THREE.TextureLoader().load("../textures/Wall.jpg")

        WallTexture.wrapS = THREE.RepeatWrapping;
        WallTexture.wrapT = THREE.RepeatWrapping;

        WallTexture.repeat.set(4,4)
        WallTexture.colorSpace = THREE.SRGBColorSpace


        let wallMat = new THREE.MeshStandardMaterial({color: 0x0000ff, side: THREE.DoubleSide, map: WallTexture})
        let roofMat = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide, map: WallTexture})
        
        this.wallGroup = new THREE.Group();

        let frontWall = this.addFrontWall(roomWidth, roomHeight, wallMat);
        let rightWall = new THREE.Mesh(sideWallGeo, wallMat);
        let leftWall = new THREE.Mesh(sideWallGeo, wallMat);        
        let backWall = new THREE.Mesh(backWallGeo, wallMat);
        let roof = new THREE.Mesh(roofGeo, roofMat);



        //walls will be positioned around the origin of the group at the bottom left corner of da room

        //this wall is the only wall that has its origin at bottom left because it is made from a shape
        frontWall.position.set(0, 0, 0)

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

    addFloor(floorTexturePath){
        const floorGeo = new PlaneGeometry(this.width, this.depth);
        let floorTexture = new THREE.TextureLoader().load(floorTexturePath)

        floorTexture.colorSpace = THREE.SRGBColorSpace;
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;

        floorTexture.repeat.set(4,4)

        const floorMat = new THREE.MeshPhongMaterial({map: floorTexture, side: THREE.DoubleSide});

        const floorMesh = new THREE.Mesh(floorGeo, floorMat);

        floorMesh.rotateX(Math.PI / 2);
        floorMesh.position.set(this.width / 2, 0, -this.depth / 2);

        this.add(floorMesh)
    }

    addFrontWall(roomWidth, roomHeight, wallMat){
        let shape = new THREE.Shape();
        shape.setFromPoints(
            [new THREE.Vector2(0,0),
            new THREE.Vector2(0,roomHeight),
            new THREE.Vector2(roomWidth,roomHeight),
            new THREE.Vector2(roomWidth,0)
            ]
        );

        let holeStartX = (roomWidth - this.door.doorWidth) / 2;
        const hole = new THREE.Path();
        hole.moveTo(holeStartX, 0); //bottom left corner of da door
        hole.lineTo(holeStartX, this.door.doorHeight);
        hole.lineTo(holeStartX + this.door.doorWidth, this.door.doorHeight);
        hole.lineTo(holeStartX + this.door.doorWidth, 0);
        hole.lineTo(holeStartX, 0);

        shape.holes.push(hole);

        let frontWallGeo = new THREE.ExtrudeGeometry(shape);
        let frontWallMat = wallMat

        return new THREE.Mesh(frontWallGeo, frontWallMat)
    }

    setDepth(){
        const box = new THREE.Box3().setFromObject(this);
        const size = new THREE.Vector3();
        box.getSize(size);   
        this.depth = size.z;     
    }
    
}