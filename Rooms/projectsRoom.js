import * as THREE from 'three'
import { Room } from "./room";
import { projectsData } from '../Data/projects';
import { Sign } from '../Objects/sign';
import { Image } from '../Objects/image';

export class ProjectsRoom extends Room{


    //the signs in the room
    signsList = [];


    signSpacing = 10;



    constructor(roomWidth){
        super(0, roomWidth)
        this.addSigns()
        this.addCollectible()
        

    }

    //will add one of my certificates on the floor
    addCollectible(){
        this.certificate = new Image({
            width: 2,
            height: 4,
            padding: 1
        });
        this.certificate.rotateX(Math.PI / 2);
        this.add(this.certificate)

        //put it at random position in the room
        this.certificate.position.x = this.roomWidth / 2;
        this.certificate.position.z = -20

    }

    addSigns(){
        let projectKeys = Object.keys(projectsData); 
        let currProjectKeyIdx = 0;
        let currProjectKey = projectKeys[currProjectKeyIdx];
        //place left signs
        let leftSignsPos = new THREE.Vector3(4, 0, -this.signSpacing);

        const leftSideSignsNum = 3
        const rightSideSignsNum = 3;

        for(let i = 0 ; i < leftSideSignsNum ; i++){
            let sign = new Sign({signID: currProjectKey,
            signPic: projectsData[currProjectKey].imagePath,
            signName: projectsData[currProjectKey].name,
            padding: this.signSpacing / 2});

            this.addSignAt(sign, leftSignsPos)
            sign.rotateY(Math.PI / 2)
            leftSignsPos.z -= this.signSpacing;
            currProjectKeyIdx = (currProjectKeyIdx + 1) % projectKeys.length;
            currProjectKey = projectKeys[currProjectKeyIdx]
        }


        let rightSignsX = this.roomWidth - 4
        let rightSignsPos = new THREE.Vector3(rightSignsX, 0, -this.signSpacing);

        //place right signs
        for(let i = 0 ; i < rightSideSignsNum ; i++){
            let sign = new Sign({signID: currProjectKey,
            signPic: projectsData[currProjectKey].imagePath,
            signName: projectsData[currProjectKey].name,
            padding: this.signSpacing / 2});

            this.addSignAt(sign, rightSignsPos)
            sign.rotateY(-Math.PI / 2)
            rightSignsPos.z -= this.signSpacing;
            currProjectKeyIdx = (currProjectKeyIdx + 1) % projectKeys.length;
            currProjectKey = projectKeys[currProjectKeyIdx]
        }    

        //place central sign
        let centralSignPos = new THREE.Vector3().copy(rightSignsPos) //get last x
        centralSignPos.x = this.roomWidth / 2;
        let sign = new Sign({signID: currProjectKey,
            signPic: projectsData[currProjectKey].imagePath,
            signName: projectsData[currProjectKey].name,
            signBaseHeight: 5,
            signBaseWidth: 2,
            signMainWidth: 10,
            signMainHeight: 10});

        this.addSignAt(sign, centralSignPos)
    }

    addSignAt(sign, pos){
        this.add(sign)
        this.signsList.push(sign)
        sign.setPosition(pos);
    }
}