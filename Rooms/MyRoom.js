import { Room } from "./room";
import * as THREE from 'three'
import { commonTextures } from "../loader";
import { skills } from "../Data/skills";
import { TimelineBoard } from "../Objects/myTimeline";
import { profiles } from "../Data/profiles";
import { Sign } from '../Objects/sign'
import { handleInteraction } from "../Utils/interactionsUtils";
import { SkillsBoardsGroup } from "../Objects/skillsBoardGroup";
import { timelineData } from "../Data/timeline";

export class MyRoom extends Room{


    nextSkillTransitionInterval;

    prevSkillTransitionInterval;

    signsList = []

    //my room will have an image of me

    //need position early for clipping planes
    constructor(width, height, depth, pos){
        super({
            height: height,
            depth: depth
        })
        //this.position.copy(pos)

        this.addContact()

        this.addMyImage()

        this.addDoor()

        this.addTimelineBoard()

        this.addSkillsBoards()


        this.addWalls("../textures/innerWall.jpg", 0x0000ff)

        this.addFloor("../textures/floor.jpg", 4)

        this.addLight()

        //this.addCollectible("Testing")

        this.addTitle("About Me", ~0x0000ff)


    }

    addContact(){


        //add three signs for my contacts
        let signsWallOffset = 1.5
        let signSpacing = 13

        //place left signs
        let signsPos = new THREE.Vector3(signsWallOffset + signSpacing, 0, -this.depth + 0.1);



        for(let i = 0 ; i < profiles.length ; i++){
            let sign = new Sign({
                signID: i,
                signPic: "../textures/profiles/" + profiles[i].image,
                signName: profiles[i].name,
                signBaseText: profiles[i].name,
                signBaseColor: 0x00ff00,
                padding: signSpacing / 2,
                signScale: 1.2,
                controls: profiles[i].name + "<br>E - Show"});
            
            console.log("at " + signsPos.x)

            sign.interactions['e'] = () => {handleInteraction(profiles[i].profile, "OPEN_LINK")}
            this.add(sign)
            this.signsList.push(sign)
            sign.position.copy(signsPos)
            signsPos.x += signSpacing;
        }        

        //set depth
        this.width = 2 * signsWallOffset + (profiles.length + 1) * signSpacing

        console.log("width is ", this.width)


    }


    addTimelineBoard(){
        let tWidth = 20;
        let margin = 1.5
        this.timeLineBoard = new TimelineBoard({
            width: tWidth,
            height: 15,
            timeLineList: timelineData,
            clipPlanes : [
                new THREE.Plane(new THREE.Vector3(0, 0, -1), -this.depth / 2 + tWidth / 2 - margin),
                new THREE.Plane(new THREE.Vector3(0, 0, 1), this.depth / 2 + tWidth / 2  - margin),                
            ]
        });
        this.timeLineBoard.rotateY(-Math.PI / 2)
        this.timeLineBoard.position.x = this.width - 0.5
        //this.timeLineBoard.position.y = 0
        this.timeLineBoard.position.z -= this.depth / 2;
        this.add(this.timeLineBoard)

        //set up interactions
        this.timeLineBoard.interactions['n'] = () => {
            handleInteraction(this.timeLineBoard, "NEXT")
        }

        this.timeLineBoard.interactions['p'] = () => {
            handleInteraction(this.timeLineBoard, "PREV")
        }

        this.timeLineBoard.interactions['e'] = () => {
            handleInteraction(timelineData[this.timeLineBoard.currImageIdx].dialogue, "START_DIAG")
        }

        this.timeLineBoard.controls = timelineData[0].name + "<br>E - Show Brief<br>N - Next<br>P - Previous"
    }

    //will be two skill boards at a time
    addSkillsBoards(){


        let margin = 1.5
        let boardWidth = 20;

        let clippingPlanes = [
        new THREE.Plane(new THREE.Vector3(0, 0, -1), -this.depth/ 2 + boardWidth / 2 - margin),
        new THREE.Plane(new THREE.Vector3(0, 0, 1), -(-this.depth / 2 - boardWidth / 2 + margin)),
        ]

        let skillsBoardGroup = new SkillsBoardsGroup({boardWidth: boardWidth, clippingPlanes: clippingPlanes, boardHeight: 15});
        skillsBoardGroup.position.set(1, 0, -this.depth / 2)
        

        skillsBoardGroup.interactions['n'] = () => {
            handleInteraction(skillsBoardGroup, "NEXT")
        }

        skillsBoardGroup.interactions['p'] = () => {
            handleInteraction(skillsBoardGroup, "PREV")
        }

        skillsBoardGroup.boardsList.forEach(board => {
            board.interactions ??= {};

            board.interactions['e'] = () => {
                handleInteraction(skills[board.boardName].dialogue, "START_DIAG");
            };
        });

        this.add(skillsBoardGroup)

        this.skillsBoardGroup = skillsBoardGroup

        skillsBoardGroup.rotateY(Math.PI / 2)
    }

    addMyImage(){
        let myTexture = commonTextures["me"].texture
        myTexture.colorSpace = THREE.SRGBColorSpace
        let myImageGeo = new THREE.PlaneGeometry(10,10)
        let myImageMat = new THREE.MeshBasicMaterial({map: myTexture})

        let myImage = new THREE.Mesh(myImageGeo, myImageMat)
        this.myImage = myImage
        this.add(myImage)

        myImage.position.set(this.width / 2, 20, - this.depth + 0.1)
    }

    updateClippingPlanes(){
        let roomWorldPos = new THREE.Vector3();
        this.getWorldPosition(roomWorldPos)
        this.skillsBoardGroup.clippingPlanes[0].constant += roomWorldPos.z
        this.skillsBoardGroup.clippingPlanes[1].constant -= roomWorldPos.z

        this.timeLineBoard.clipPlanes[0].constant += roomWorldPos.z
        this.timeLineBoard.clipPlanes[1].constant -= roomWorldPos.z
    }

  
}