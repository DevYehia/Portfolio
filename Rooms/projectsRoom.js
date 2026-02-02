import * as THREE from 'three'
import { Room } from "./room";
import { projectsData } from '../Data/projects';
import { Sign } from '../Objects/sign';
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
        this.depth = currRoomDims.z + 1;
        this.addWalls(0x00ffff)

        this.addFloor()

        this.addCollectible("Linux")

        this.addTitle("Projects", ~0x00ffff)

        this.addLight()

    }



    addSigns(){

        let currProjectKeyIdx = 0;

        let signsWallOffset = 1.5

        //place left signs
        let leftSignsPos = new THREE.Vector3(signsWallOffset, 0, -this.signSpacing);

        const leftSideSignsNum = 3
        const rightSideSignsNum = 3;

        this.placeSignsRow(currProjectKeyIdx, leftSignsPos, leftSideSignsNum, Math.PI / 2, 1.2)
        currProjectKeyIdx+=3

        let rightSignsX = this.width - signsWallOffset
        let rightSignsPos = new THREE.Vector3(rightSignsX, 0, -this.signSpacing);
        

        this.placeSignsRow(currProjectKeyIdx, rightSignsPos, rightSideSignsNum, -Math.PI / 2, 1.2)        
        currProjectKeyIdx+=3

        //place central sign
        let centralSignPos = new THREE.Vector3().copy(rightSignsPos) //get last x
        centralSignPos.x = this.width / 2;

        this.placeSignsRow(currProjectKeyIdx, centralSignPos, 1, 0, 3)
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

    placeSignsRow(currProjectKeyIdx, currPos, numSigns, signRot, signScale){
        let projectKeys = Object.keys(projectsData); 
        let currProjectKey = projectKeys[currProjectKeyIdx];

        let controls = "V - Show Video<br>E - Interact<br>G - Github";

        for(let i = 0 ; i < numSigns ; i++){

            let controlsTitle = "<p id = 'controlsTitle'>" + projectsData[currProjectKey].name.replace("\n", "<br>") + "</p>"

            let sign = new Sign({signID: currProjectKey,
            signPic: "../textures/Projects/" + projectsData[currProjectKey].imagePath,
            signName: projectsData[currProjectKey].name,
            signBaseText: projectsData[currProjectKey].tech,
            padding: this.signSpacing / 2,
            signScale: signScale,
            controls: controlsTitle +  controls});

            this.addSignAt(sign, currPos)
            sign.rotateY(signRot)
            currPos.z -= this.signSpacing;
            currProjectKeyIdx = (currProjectKeyIdx + 1) % projectKeys.length;
            currProjectKey = projectKeys[currProjectKeyIdx]
        }        
    }

}