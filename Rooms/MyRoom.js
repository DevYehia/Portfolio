import { Room } from "./room";
import * as CustomObjects from '../Objects/image'
import * as THREE from 'three'

export class MyRoom extends Room{

    //my room will have an image of me

    constructor(roomWidth){
        super(0, roomWidth)
        let myImage = new CustomObjects.Image({
            width: 10,
            height: 10,
            padding: 5,
            name: "Yehia"
        });
        myImage.position.set(-20, 10 / 2, -roomWidth / 2)
        this.add(myImage)
    }
}