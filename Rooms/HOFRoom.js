import * as THREE from 'three'
import { Room } from './room'

export class HOFRoom extends Room{


    //this is the board where the ppl will be displayed
    board;

    imageDim = 2

    imageSpacing = 0.5;

    constructor(roomWidth, pplList){
        super(0, roomWidth)

        let numPeople = pplList.length;
        let numPplInRow = numPeople / 3
        //init the board
        let boardWidth = (numPplInRow) * (this.imageDim) + (numPplInRow + 1) * (this.imageSpacing); //there will be three rows
        let boardHeight = (this.imageDim) * 3 + this.imageSpacing * 4;

        const boardGeo = new THREE.PlaneGeometry(boardWidth, boardHeight);
        const boardMat = new THREE.MeshBasicMaterial({color : 0xff0000, side: THREE.DoubleSide})

        this.board = new THREE.Mesh(boardGeo, boardMat)

        let offSet = 1

        this.board.position.x += 30;
        this.board.position.y += boardHeight / 2 + offSet
        this.board.position.z -= roomWidth / 2
        this.board.rotateY(Math.PI / 2)

        console.log("Plane is at " + JSON.stringify(this.board))

        this.group.add(this.board)



        //place the images
        let currPos = new THREE.Vector3().copy(this.board.position);
        currPos.x -= 0.1;
        currPos.y = this.imageSpacing + this.imageDim / 2 + offSet;
        currPos.z += -boardWidth / 2+ this.imageSpacing + this.imageDim / 2
        let origZ = currPos.z
        for(let row = 0 ; row < numPplInRow ; row++){

            for(let col = 0 ; col < 3 ; col++)
            {
                const imageGeo = new THREE.PlaneGeometry(this.imageDim, this.imageDim);
                const imageMat = new THREE.MeshBasicMaterial({color : 0x00ff00, side: THREE.DoubleSide})       
                
                let img = new THREE.Mesh(imageGeo, imageMat);
                img.rotateY(Math.PI/2)
                img.position.copy(currPos)
                this.group.add(img)
                currPos.z += this.imageDim + this.imageSpacing
            }
            currPos.z = origZ
            currPos.y +=  this.imageDim + this.imageSpacing
        }

    }
}