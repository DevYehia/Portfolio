import { Room } from "./room";
import * as CustomObjects from '../Objects/image'
import { FixedLengthBoard } from "../Objects/Boards/fixedLengthBoard";
import { VarLengthBoard } from "../Objects/Boards/variableLengthBoard";
import * as THREE from 'three'

export class MyRoom extends Room{

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
           // new THREE.Plane(new THREE.Vector3(0, 0, -1), roomWorldPos.z -this.roomDepth / 2 + 5)
           // new THREE.Plane(new THREE.Vector3(0, 0, 1), -this.roomDepth / 2 - 5),            
        ]

        let boardWidth = 10;
        let imageSpacing = 1;

        let imageDim = boardWidth


        for(let i = 0 ; i < 3 ; i++){

            let board = new VarLengthBoard(
                    {
                        id: i,
                        boardName: "Num " + i,
                        pplList: dummyList,
                        boardDim: 10,
                        numRows: 2,
                        clippingPlanes: clippingPlanes
                    }
                )
            board.position.y += board.boardHeight / 2
            board.rotateY(Math.PI / 2)
            this.boardsList.push(board)
        }

        //setup current board
        this.currBoardIdx = 0;

        let boardWidth = this.boardsList[0].boardWidth;

        this.boardsList[0].position.z = -this.roomDepth / 2;
        this.boardsList[1].position.z = this.boardsList[0].position.z + boardWidth + 3;

        this.add(this.boardsList[0], this.boardsList[1])


        



    }
}