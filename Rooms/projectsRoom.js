import * as THREE from 'three'
import { Room } from "./room";
import { projectsData } from '../Data/projects';
import { Sign } from '../Objects/sign';
import { Image } from '../Objects/image';
import { Collectible } from '../Objects/collectible';

export class ProjectsRoom extends Room{


    //the signs in the room
    signsList = [];


    signSpacing = 13;

    certificate = null;



    constructor({
        width = null,
        height = null
    } = {}){
        super({
            width: width,
            height: height
        })
        this.addSigns()
        this.addCollectible()
        let currRoomDims = this.getRoomDims();
        //this.setDims(this.width, this.height, currRoomDims.z + 1)
        console.log("room dims is " + JSON.stringify(currRoomDims))
        this.depth = currRoomDims.z + 1;
        this.addWalls()

        this.addFloor("../textures/floor.jpg")

        this.addLight()

    }

    //will add one of my certificates on the floor
    addCollectible(){
        this.certificate = new Collectible({
            width: 4,
            height: 2,
            padding: 5,
            particlesColor: 0x000000
        });
        this.add(this.certificate)

        //put it at random position in the room
        this.certificate.position.x = this.width / 2;
        this.certificate.position.z = -20
        this.certificate.position.y += 0.1

    }

    addSigns(){
        let projectKeys = Object.keys(projectsData); 
        let currProjectKeyIdx = 0;
        let currProjectKey = projectKeys[currProjectKeyIdx];

        let signsWallOffset = 1.5

        //place left signs
        let leftSignsPos = new THREE.Vector3(signsWallOffset, 0, -this.signSpacing);

        const leftSideSignsNum = 3
        const rightSideSignsNum = 3;

        for(let i = 0 ; i < leftSideSignsNum ; i++){
            let sign = new Sign({signID: currProjectKey,
            signPic: "../textures/Projects/" + projectsData[currProjectKey].imagePath,
            signName: projectsData[currProjectKey].name,
            signBaseText: projectsData[currProjectKey].tech,
            padding: this.signSpacing / 2,
            signScale: 1.2});

            this.addSignAt(sign, leftSignsPos)
            sign.rotateY(Math.PI / 2)
            leftSignsPos.z -= this.signSpacing;
            currProjectKeyIdx = (currProjectKeyIdx + 1) % projectKeys.length;
            currProjectKey = projectKeys[currProjectKeyIdx]
        }


        let rightSignsX = this.width - signsWallOffset
        let rightSignsPos = new THREE.Vector3(rightSignsX, 0, -this.signSpacing);

        //place right signs
        for(let i = 0 ; i < rightSideSignsNum ; i++){
            let sign = new Sign({signID: currProjectKey,
            signPic: "../textures/Projects/" + projectsData[currProjectKey].imagePath,
            signName: projectsData[currProjectKey].name,
            signBaseText: projectsData[currProjectKey].tech,
            padding: this.signSpacing / 2,
            signScale: 1.2});

            this.addSignAt(sign, rightSignsPos)
            sign.rotateY(-Math.PI / 2)
            rightSignsPos.z -= this.signSpacing;
            currProjectKeyIdx = (currProjectKeyIdx + 1) % projectKeys.length;
            currProjectKey = projectKeys[currProjectKeyIdx]
        }    

        //place central sign
        let centralSignPos = new THREE.Vector3().copy(rightSignsPos) //get last x
        centralSignPos.x = this.width / 2;
        let sign = new Sign({signID: currProjectKey,
            signPic: "../textures/Projects/" +  projectsData[currProjectKey].imagePath,
            signName: projectsData[currProjectKey].name,
            signBaseText: projectsData[currProjectKey].tech,
            signScale: 3});

        this.addSignAt(sign, centralSignPos)
    }

    addSignAt(sign, pos){
        this.add(sign)
        this.signsList.push(sign)
        sign.position.copy(pos);
    }
}