import * as THREE from 'three'
import { SkillsBoard } from './skillsBoard';
import { skills } from '../Data/skills';
import { Interactable } from './interactable';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { HOFTitlefont } from '../loader';
import { makeControls } from '../Utils/textUtils';

export class SkillsBoardsGroup extends Interactable{

    boardsList = []

    nextSkillTransitionInterval = null
    prevSkillTransitionInterval = null


    constructor({
        imageDim = 3,
        boardWidth = 10,
        boardHeight = 5,
        heightOffset = 0,
        numRows = 2,
        clippingPlanes = []} = {}){

            super({
                showMenu: true,
                menuTitle: ""
            })


            this.clippingPlanes = clippingPlanes
            this.boardWidth = boardWidth
            this.boardHeight = boardHeight

            let imageSpacing = 1;

            //add board title
            this.addTitle()

            this.addMainBoard()

            //this.boardMesh.rotateY(Math.PI / 2)

            for(let key in skills){


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
                board.position.y += board.boardHeight / 2
                //board.rotateY(Math.PI / 2)
                this.boardsList.push(board)
            }

            //setup current board
            this.prevBoardIdx = this.boardsList.length - 1;
            this.currBoardIdx = 0;
            this.nextBoardIdx = 1;

            //add current, next and previous boards to object
            //next and previous should not appear due to clipping plane
            this.boardsList[0].position.x = 0;
            this.boardsList[1].position.x = this.boardsList[0].position.x + boardWidth;
            this.boardsList[this.prevBoardIdx].position.x = this.boardsList[0].position.x - boardWidth;

            this.add(this.boardsList[0], this.boardsList[1], this.boardsList[this.prevBoardIdx])

            //set up menuTitle
            this.menuTitle = this.boardsList[0].boardName



        }

    addTitle(){
        //set up title
        const ttlGeometry = new TextGeometry("SKILLS", {
            font: HOFTitlefont,
            size : 4,
            depth: 0.2
        })            
        const ttlMat = new THREE.MeshBasicMaterial({color: 0xff0000})
            //add title
        let ttl = new THREE.Mesh(ttlGeometry, ttlMat);
        this.ttl = ttl
        ttl.position.y += this.boardHeight
        let ttlSize = new THREE.Vector3()
        this.ttl.geometry.computeBoundingBox()
        this.ttl.position.x -= this.ttl.geometry.boundingBox.getSize(ttlSize).x / 2
        this.ttl.position.y += ttlSize.y / (2) ;


        this.add(ttl);
    }

    addMainBoard(){
        const texture = new THREE.TextureLoader().load( "textures/border3.jpg" );
        texture.colorSpace = THREE.SRGBColorSpace

        //add the board
        const baordGeo = new THREE.PlaneGeometry(this.boardWidth, this.boardHeight);
        const boardMat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture});
        this.boardMesh = new THREE.Mesh(baordGeo, boardMat);      
        this.add(this.boardMesh)      
        this.hitBox = this.boardMesh
        this.boardMesh.position.y += this.boardHeight / 2
    }
    


    next(){
        if(this.nextSkillTransitionInterval == null && this.prevSkillTransitionInterval == null)
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
        if(nextBoard.position.x <= 0){

            //update controls 
            //this.controls = makeControls(nextBoard.boardName, "N - Next<br>P - Prev")
            //this.updateDivContent() //to update controls div
            this.menuTitle = nextBoard.boardName
            this.updateOptionsMenu()

           // console.log("How are we here")
            //to handle offshooting
            nextBoard.position.x = 0

            //remove original prev board
            //curr is now prev
            this.remove(this.boardsList[this.prevBoardIdx])

            this.prevBoardIdx = this.currBoardIdx;
            this.currBoardIdx = this.nextBoardIdx;
            this.nextBoardIdx = (this.nextBoardIdx + 1) % this.boardsList.length;


            //add the waiting board
            this.boardsList[this.nextBoardIdx].position.x = this.boardsList[this.currBoardIdx].position.x + this.boardWidth;
            this.add(this.boardsList[this.nextBoardIdx])

            

            clearInterval(this.nextSkillTransitionInterval)
            this.nextSkillTransitionInterval = null;

        }

        //move both boards

        currBoard.position.x -= 1 / 10;
        nextBoard.position.x -= 1 / 10;        
    }

    prev(){
        if(this.nextSkillTransitionInterval == null && this.prevSkillTransitionInterval == null)
            this.prevSkillTransitionInterval = setInterval(this.animatePrevSkill.bind(this), 1 / 100)
    }

    animatePrevSkill(){
        let currBoard = this.boardsList[this.currBoardIdx]
        let prevBoard = this.boardsList[this.prevBoardIdx]


        //check have we reahced destination
        if(prevBoard.position.x >= 0){

            //update controls 
            //this.controls = makeControls(prevBoard.boardName, "N - Next<br>P - Prev")
            this.menuTitle = prevBoard.boardName
            this.updateOptionsMenu() //to update title

            let nextBoard = this.boardsList[this.nextBoardIdx]
            //to handle offshooting
            prevBoard.position.x = 0

            //remove next board
            //curr board is now next board
            this.remove(nextBoard)


            this.nextBoardIdx = this.currBoardIdx;
            this.currBoardIdx = this.prevBoardIdx;
            this.prevBoardIdx = (this.prevBoardIdx - 1 + this.boardsList.length) % this.boardsList.length


            //add the new prev board
            this.boardsList[this.prevBoardIdx].position.x = this.boardsList[this.currBoardIdx].position.x - this.boardWidth;


            this.add(this.boardsList[this.prevBoardIdx])


            clearInterval(this.prevSkillTransitionInterval)
            this.prevSkillTransitionInterval = null;

        }

        //move both boards

        currBoard.position.x += 1 / 10;
        prevBoard.position.x += 1 / 10;        
    }




}