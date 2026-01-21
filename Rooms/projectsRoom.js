import * as THREE from 'three'
import { Room } from "./room";
import { projectsData } from '../Data/projects';
import { Sign } from '../Objects/sign';
import { Collectible } from '../Objects/collectible';
import { handleInteraction } from '../Utils/interactionsUtils';

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

        let currRoomDims = this.getRoomDims();
        //this.setDims(this.width, this.height, currRoomDims.z + 1)
        console.log("room dims is " + JSON.stringify(currRoomDims))
        this.depth = currRoomDims.z + 1;
        this.addWalls("../textures/innerWall.jpg", 0x00ffff)

        this.addFloor("../textures/floor.jpg", 4)

        //this.addCollectible("Linux")

        this.addTitle("Projects", ~0x00ffff)

        this.addLight()

    }



    addSigns(){


        let projectKeys = Object.keys(projectsData); 
        let currProjectKeyIdx = 0;
        let currProjectKey = projectKeys[currProjectKeyIdx];

        let controls = "<br><br>V - Show Video<br>E - Interact<br>G - Github";

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
            signScale: 1.2,
            controls: projectsData[currProjectKey].name.replace("\n", " ") +  controls});

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
            signScale: 1.2,
            controls: projectsData[currProjectKey].name.replace("\n", " ") +  controls});

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
            signScale: 3,
            controls: projectsData[currProjectKey].name.replace("\n", " ") +  controls});

        this.addSignAt(sign, centralSignPos)
    }

    addSignAt(sign, pos){
        this.add(sign)
        this.signsList.push(sign)
        sign.position.copy(pos);

        //setup sign interactions
        //setup interactions
        sign.interactions['v'] = () => {
            handleInteraction(projectsData[sign.signID].video, "OPEN_VIDEO")
        }

        sign.interactions['g'] = () => {
            handleInteraction(projectsData[sign.signID].github, "OPEN_LINK")
        }

        sign.interactions['e'] = () => {
            handleInteraction(projectsData[sign.signID].dialogue, "START_DIAG")
        }
    }
}