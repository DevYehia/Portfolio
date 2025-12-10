import { Room } from "./room";
import * as CustomObjects from '../Objects/image'
import { Board } from "../Objects/board";
import * as THREE from 'three'
import { SkillsBoard } from "../Objects/skillsBoard";
import { skills } from "../Data/skills";

export class MyRoom extends Room{


    nextSkillTransitionInterval;

    prevSkillTransitionInterval;

    //my room will have an image of me

    //need position early for clipping planes
    constructor(roomWidth, pos){
        super(0, roomWidth)
        this.position.copy(pos)
        let myImage = new CustomObjects.Image({
            width: 10,
            height: 10,
            padding: 5,
            name: "Yehia"
        });
        myImage.position.set(roomWidth / 2, 10 / 2, -50)
        this.add(myImage)

        this.setDepth();

        this.addSkillsBoards()
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
        console.log("plane at " + roomWorldPos.z -this.roomDepth / 2 + 5)

        let clippingPlanes = [
           new THREE.Plane(new THREE.Vector3(0, 0, -1), roomWorldPos.z - this.roomDepth / 2 + 5), 
           new THREE.Plane(new THREE.Vector3(0, 0, 1), -(roomWorldPos.z -this.roomDepth / 2 - 5)),
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
        this.boardsList[0].position.z = -this.roomDepth / 2;
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
        if(nextBoard.position.z <= -this.roomDepth / 2){


            //to handle offshooting
            nextBoard.position.z = -this.roomDepth / 2

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
        if(prevBoard.position.z >= -this.roomDepth / 2){

            let nextBoard = this.boardsList[this.nextBoardIdx]
            //to handle offshooting
            prevBoard.position.z = -this.roomDepth / 2

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