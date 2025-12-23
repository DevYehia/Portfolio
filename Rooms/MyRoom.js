import { Room } from "./room";
import * as THREE from 'three'
import { SkillsBoard } from "../Objects/skillsBoard";
import { skills } from "../Data/skills";
import { TimelineBoard } from "../Objects/myTimeline";
import { profiles } from "../Data/profiles";
import { Sign } from '../Objects/sign'
import { handleInteraction } from "../Utils/interactionsUtils";
import { SkillsBoardsGroup } from "../Objects/skillsBoardGroup";

export class MyRoom extends Room{


    nextSkillTransitionInterval;

    prevSkillTransitionInterval;

    signsList = []

    //my room will have an image of me

    //need position early for clipping planes
    constructor(width, height, depth, pos){
        super({
            width: width,
            height: height,
        })
        this.position.copy(pos)

        this.addContact()


        this.addTimelineBoard()

        this.addSkillsBoards()


        //this.addWalls()


    }

    addContact(){


        //add three signs for my contacts
        let signsWallOffset = 1.5
        let signSpacing = 13

        //place left signs
        let signsPos = new THREE.Vector3(this.width - signsWallOffset, 0, -signSpacing);



        for(let i = 0 ; i < profiles.length ; i++){
            let sign = new Sign({
                signID: i,
                signPic: "../textures/profiles/" + profiles[i].image,
                signName: profiles[i].name,
                signBaseText: profiles[i].name,
                padding: signSpacing / 2,
                signScale: 1.2,
                controls: profiles[i].name + "<br>E - Show"});

            sign.interactions['e'] = () => {handleInteraction(profiles[i].profile, "OPEN_LINK")}
            this.add(sign)
            this.signsList.push(sign)
            sign.position.copy(signsPos)
            sign.rotateY(-Math.PI / 2)
            signsPos.z -= signSpacing;
        }        

        //set depth
        this.depth = -signsPos.z


    }


    addTimelineBoard(){
        console.log("depth is at " + this.depth)
        this.timeLineBoard = new TimelineBoard();
        this.timeLineBoard.position.x = this.width / 2
        this.timeLineBoard.position.y = 5
        this.timeLineBoard.position.z -= this.depth - 1;
        this.add(this.timeLineBoard)
    }

    //will be two skill boards at a time
    addSkillsBoards(){

        let roomWorldPos = new THREE.Vector3();
        this.getWorldPosition(roomWorldPos)

        let boardWidth = 15;

        let clippingPlanes = [
        new THREE.Plane(new THREE.Vector3(0, 0, -1), roomWorldPos.z - this.depth/ 2 + boardWidth / 2), 
        new THREE.Plane(new THREE.Vector3(0, 0, 1), -(roomWorldPos.z -this.depth / 2 - boardWidth / 2)),
        ]

        let skillsBoardGroup = new SkillsBoardsGroup({boardWidth: boardWidth, clippingPlanes: clippingPlanes, boardHeight: 12});
        skillsBoardGroup.position.set(1, 5, -this.depth / 2)

        //set up interactions
        for(let boardIdx in skillsBoardGroup.boardsList){
            let board = skillsBoardGroup.boardsList[boardIdx]
            board.interactions['e'] = () => {
                handleInteraction(skills[board.boardName], "START_DIAG")
            }
        }

        this.add(skillsBoardGroup)

        this.skillsBoardGroup = skillsBoardGroup
    }

  
}