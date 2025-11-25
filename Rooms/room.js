import * as THREE from 'three'
import {Door} from '../Objects/door'

export class Room{

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

    //the group which will contain all items
    /**
     * @type {THREE.Group}
     */
    group = new THREE.Group()

    constructor(startIntensity, roomWidth){
        this.ambLight.intensity = startIntensity
        this.roomWidth = roomWidth
        this.group.add(this.ambLight);
        this.addDoor()

    }

    addDoor(){
        let doorX = 0;
        let doorY = 0;
        let doorZ = - (this.roomWidth / 2 - this.door.doorWidth / 2)
        this.door.doorMesh.rotation.y += Math.PI / 2;
        this.door.doorMesh.position.copy(new THREE.Vector3(doorX, doorY, doorZ))
        this.door.doorMesh.name = "door";
        this.group.add(this.door.doorMesh)
    }

    
}