import { Room } from "./room";
import * as CustomObjects from '../Objects/image'
import { Board } from "../Objects/board";
import * as THREE from 'three'
import { SkillsBoard } from "../Objects/skillsBoard";
import { skills } from "../Data/skills";
import { TimelineBoard } from "../Objects/myTimeline";
import { CV } from "../Objects/CV";

export class MyRoom extends Room{


    nextSkillTransitionInterval;

    prevSkillTransitionInterval;

    //my room will have an image of me

    //need position early for clipping planes
    constructor(width, height, depth, pos){
        super({
            width: width,
            height: height,
            depth: depth
        })
        this.position.copy(pos)


        this.addTimelineBoard()

        this.setDepth();

    

        this.addSkillsBoards()

        this.addCV()

        this.addWalls()


    }

    addCV(){

        //just a regular plane

        this.CVPaper = new CV();

        this.CVPaper.rotateY(Math.PI / 2);
        this.CVPaper.position.x += this.width;
        this.CVPaper.position.y += 5;
        this.CVPaper.position.z -= 10

        this.add(this.CVPaper)



    }


    addTimelineBoard(){
        this.timeLineBoard = new TimelineBoard();
        this.timeLineBoard.position.x = this.width / 2
        this.timeLineBoard.position.y = 5
        this.timeLineBoard.position.z -= this.depth - 1;
        this.add(this.timeLineBoard)
    }

    //will be two skill boards at a time
    addSkillsBoards(){
        this.boardsList = [];
        let dummyList = [
            "Yaya",
            "mohamed",
            "Ismail"
        ]

        let roomWorldPos = new THREE.Vector3();
        this.getWorldPosition(roomWorldPos)

        //add clipping planes for the animation
        console.log("World pos is " + JSON.stringify(roomWorldPos));
        console.log("plane at " + roomWorldPos.z -this.depth / 2 + 5)

        let clippingPlanes = [
           new THREE.Plane(new THREE.Vector3(0, 0, -1), roomWorldPos.z - this.depth/ 2 + 5), 
           new THREE.Plane(new THREE.Vector3(0, 0, 1), -(roomWorldPos.z -this.depth / 2 - 5)),
        ]

        //let boardWidth = 10;
        let imageSpacing = 1;

        let imageDim = 3


        for(let key in skills){

            console.log(key + " hey " + JSON.stringify(skills.key))

            let board = new SkillsBoard(
                    {
                        id: key,
                        boardName: key,
                        pplList: skills[key].list,
                        imageDim: 3,
                        numRows: skills[key].numRows,
                        clippingPlanes: clippingPlanes
                    }
                )
            board.position.y += board.boardHeight / 2
            board.position.x += 1
            board.rotateY(Math.PI / 2)
            this.boardsList.push(board)
        }

        //setup current board
        this.prevBoardIdx = this.boardsList.length - 1;
        this.currBoardIdx = 0;
        this.nextBoardIdx = 1;

        console.log(" ds" + this.prevBoardIdx)

        let boardWidth = this.boardsList[0].boardWidth;

        //add current, next and previous boards to object
        //next and previous should not appear due to clipping plane
        this.boardsList[0].position.z = -this.depth / 2;
        this.boardsList[1].position.z = this.boardsList[0].position.z + boardWidth;
        this.boardsList[this.prevBoardIdx].position.z = this.boardsList[0].position.z - boardWidth;

        this.add(this.boardsList[0], this.boardsList[1], this.boardsList[this.prevBoardIdx])


    }

    getNextSkill(){
        if(this.nextSkillTransitionInterval == null)
            this.nextSkillTransitionInterval = setInterval(this.animateNextSkill.bind(this), 1 / 100)
    }

    animateNextSkill(){
        let currBoard = this.boardsList[this.currBoardIdx]
        let nextBoard = this.boardsList[this.nextBoardIdx]

        //console.log("curr is " + currBoardIdx + " next is " + nextBoardIdx)
        //console.log()
        //console.log("pos is " + JSON.stringify(nextBoard.position))

        //check have we reahced destination
        if(nextBoard.position.z <= -this.depth / 2){


            //to handle offshooting
            nextBoard.position.z = -this.depth / 2

            //remove original prev board
            //curr is now prev
            this.remove(this.boardsList[this.prevBoardIdx])

            this.prevBoardIdx = this.currBoardIdx;
            this.currBoardIdx = this.nextBoardIdx;
            this.nextBoardIdx = (this.nextBoardIdx + 1) % this.boardsList.length;


            //add the waiting board
            this.boardsList[this.nextBoardIdx].position.z = this.boardsList[this.currBoardIdx].position.z + 10;
            this.add(this.boardsList[this.nextBoardIdx])

            

            clearInterval(this.nextSkillTransitionInterval)
            this.nextSkillTransitionInterval = null;

        }

        //move both boards

        currBoard.position.z -= 1 / 10;
        nextBoard.position.z -= 1 / 10;        
    }

    getPrevSkill(){
        if(this.prevSkillTransitionInterval == null)
            this.prevSkillTransitionInterval = setInterval(this.animatePrevSkill.bind(this), 1 / 100)
    }

    animatePrevSkill(){
        let currBoard = this.boardsList[this.currBoardIdx]
        let prevBoard = this.boardsList[this.prevBoardIdx]


        //check have we reahced destination
        if(prevBoard.position.z >= -this.depth / 2){

            let nextBoard = this.boardsList[this.nextBoardIdx]
            //to handle offshooting
            prevBoard.position.z = -this.depth / 2

            //remove next board
            //curr board is now next board
            this.remove(nextBoard)


            this.nextBoardIdx = this.currBoardIdx;
            this.currBoardIdx = this.prevBoardIdx;
            this.prevBoardIdx = (this.prevBoardIdx - 1 + this.boardsList.length) % this.boardsList.length


            //add the new prev board
            this.boardsList[this.prevBoardIdx].position.z = this.boardsList[this.currBoardIdx].position.z - 10;


            this.add(this.boardsList[this.prevBoardIdx])


            clearInterval(this.prevSkillTransitionInterval)
            this.prevSkillTransitionInterval = null;

        }

        //move both boards

        currBoard.position.z += 1 / 10;
        prevBoard.position.z += 1 / 10;        
    }
}