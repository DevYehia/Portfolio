import * as THREE from 'three'
import { SkillsBoard } from './skillsBoard';
import { skills } from '../Data/skills';

export class SkillsBoardsGroup extends THREE.Object3D{

    boardsList = []

    nextSkillTransitionInterval = null
    prevSkillTransitionInterval = null


    constructor({
        imageDim = 3,
        boardWidth = 10,
        boardHeight = 7,
        heightOffset = 0,
        numRows = 2,
        clippingPlanes = []} = {}){

            super()

            this.boardWidth = boardWidth

            let imageSpacing = 1;


            const texture = new THREE.TextureLoader().load( "textures/border3.jpg" );
            texture.colorSpace = THREE.SRGBColorSpace

            //add the board
            const baordGeo = new THREE.PlaneGeometry(boardWidth, boardHeight);
            const boardMat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture});
            this.boardMesh = new THREE.Mesh(baordGeo, boardMat);      
            this.add(this.boardMesh)      
            this.boardMesh.position.y += boardHeight / 2
            this.boardMesh.rotateY(Math.PI / 2)

            for(let key in skills){

                console.log(key + " hey " + JSON.stringify(skills.key))

                let board = new SkillsBoard(
                        {
                            boardName: key,
                            boardWidth: boardWidth,
                            boardHeight: boardHeight,
                            boardName: key,
                            pplList: skills[key].list,
                            imageDim: 6 / skills[key].numRows,
                            numRows: skills[key].numRows,
                            clippingPlanes: clippingPlanes
                        }
                    )
                //set up interactions
                board.controls = key + "<br>E - Show Brief"
                board.position.y += board.boardHeight / 2
                board.rotateY(Math.PI / 2)
                this.boardsList.push(board)
            }

            //setup current board
            this.prevBoardIdx = this.boardsList.length - 1;
            this.currBoardIdx = 0;
            this.nextBoardIdx = 1;

            console.log(" ds" + this.prevBoardIdx)
            //add current, next and previous boards to object
            //next and previous should not appear due to clipping plane
            this.boardsList[0].position.z = 0;
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

       // console.log("next pos is " + JSON.stringify(nextBoard.position.z))

        //console.log("curr is " + currBoardIdx + " next is " + nextBoardIdx)
        //console.log()
        //console.log("pos is " + JSON.stringify(nextBoard.position))

        //check have we reahced destination
        if(nextBoard.position.z <= 0){

           // console.log("How are we here")
            //to handle offshooting
            nextBoard.position.z = 0

            //remove original prev board
            //curr is now prev
            this.remove(this.boardsList[this.prevBoardIdx])

            this.prevBoardIdx = this.currBoardIdx;
            this.currBoardIdx = this.nextBoardIdx;
            this.nextBoardIdx = (this.nextBoardIdx + 1) % this.boardsList.length;


            //add the waiting board
            this.boardsList[this.nextBoardIdx].position.z = this.boardsList[this.currBoardIdx].position.z + this.boardWidth;
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
        if(prevBoard.position.z >= 0){

            let nextBoard = this.boardsList[this.nextBoardIdx]
            //to handle offshooting
            prevBoard.position.z = 0

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