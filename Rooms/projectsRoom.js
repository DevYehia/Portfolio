import * as THREE from 'three'
import { Room } from "./room";
import { projectsData } from '../projects';
import { Sign } from '../Objects/sign';

export class ProjectsRoom extends Room{


    //the signs in the room
    signsList = [];


    signSpacing = 10;



    constructor(roomWidth){
        super(0, roomWidth)
        this.addSigns()
    }

    addSigns(){
        let projectKeys = Object.keys(projectsData); 
        let currProjectKeyIdx = 0;
        let currProjectKey = projectKeys[currProjectKeyIdx];
        //place left signs
        let leftSignsPos = new THREE.Vector3(2, 0, -this.signSpacing);

        const leftSideSignsNum = 3
        const rightSideSignsNum = 3;

        for(let i = 0 ; i < leftSideSignsNum ; i++){
            let sign = new Sign(currProjectKey, projectsData[currProjectKey].imagePath, projectsData[currProjectKey].name);
            this.addSignAt(sign, leftSignsPos)
            sign.rotateSign()
            leftSignsPos.z -= this.signSpacing;
            currProjectKeyIdx = (currProjectKeyIdx + 1) % projectKeys.length;
            currProjectKey = projectKeys[currProjectKeyIdx]
        }


        let rightSignsX = this.roomWidth - 2
        let rightSignsPos = new THREE.Vector3(rightSignsX, 0, -this.signSpacing);

        //place right signs
        for(let i = 0 ; i < rightSideSignsNum ; i++){
            let sign = new Sign(currProjectKey, projectsData[currProjectKey].imagePath, projectsData[currProjectKey].name);
            this.addSignAt(sign, rightSignsPos)
            sign.rotateSign()
            rightSignsPos.z -= this.signSpacing;
            currProjectKeyIdx = (currProjectKeyIdx + 1) % projectKeys.length;
            currProjectKey = projectKeys[currProjectKeyIdx]
        }    

        //place central sign
        let centralSignPos = new THREE.Vector3().copy(rightSignsPos) //get last x
        centralSignPos.x = this.roomWidth / 2;
        let sign = new Sign(currProjectKey, projectsData[currProjectKey].imagePath, projectsData[currProjectKey].name);
        this.addSignAt(sign, centralSignPos)
    }

    addSignAt(sign, pos){
        this.add(sign)
        this.signsList.push(sign)
        sign.setPosition(pos);
    }
}