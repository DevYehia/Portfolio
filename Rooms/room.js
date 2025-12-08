import * as THREE from 'three'
import {Door} from '../Objects/door'

export class Room extends THREE.Object3D{

    //the door to enter the room
    /**
     * @type {Door}
     */
    door = new Door(true);

    //the ambient light of the room
    /**
     * @type {THREE.AmbientLight}
     */    
    ambLight = new THREE.AmbientLight(0xffffff, 0);
    //ambLight = new THREE.HemisphereLight()

    //not included in constructor will be calculated after child's constructor
    roomDepth;


    constructor(startIntensity, roomWidth){
        super()
        this.ambLight.intensity = startIntensity
        this.roomWidth = roomWidth
        this.add(this.ambLight);
        this.addDoor()

    }

    addDoor(){
        let doorX = (this.roomWidth / 2 - this.door.doorWidth / 2);
        let doorY = 0;
        let doorZ = 0;
        this.door.position.copy(new THREE.Vector3(doorX, doorY, doorZ))
        this.door.name = "door";
        this.add(this.door)
    }

    //didn't make it in constructor as room depth is sometimes calculated dynamically
    addWalls(roomWidth, roomHeight, roomDepth){

        const backWallGeo = new THREE.PlaneGeometry(roomWidth, roomHeight);
        const sideWallGeo = new THREE.PlaneGeometry(roomDepth, roomHeight);
        const roofGeo = new THREE.PlaneGeometry(roomWidth, roomDepth)
        const WallTexture = new THREE.TextureLoader().load("../textures/Wall.jpg")

        //WallTexture.wrapS = THREE.RepeatWrapping;
        //WallTexture.wrapT = THREE.RepeatWrapping;

        //WallTexture.repeat.set(4,4)


        let wallMat = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide, map: WallTexture})

        this.wallGroup = new THREE.Group();

        let frontWall = this.addFrontWall(roomWidth, roomHeight);
        let rightWall = new THREE.Mesh(sideWallGeo, wallMat);
        let leftWall = new THREE.Mesh(sideWallGeo, wallMat);        
        let backWall = new THREE.Mesh(backWallGeo, wallMat);
        let roof = new THREE.Mesh(roofGeo, wallMat);


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

    addFrontWall(roomWidth, roomHeight){
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
        let frontWallMat = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide}); //will not be affected by lighting

        return new THREE.Mesh(frontWallGeo, frontWallMat)
    }

    setDepth(){
        const box = new THREE.Box3().setFromObject(this);
        const size = new THREE.Vector3();
        box.getSize(size);   
        this.roomDepth = size.z;     
    }
    
}