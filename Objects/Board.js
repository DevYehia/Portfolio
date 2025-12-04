import * as THREE from 'three'
import { Image } from './image'


export class Board extends THREE.Object3D{

    worldPos = new THREE.Vector3()


    constructor({
        pplList = [],
        imageDim = 3,
        imageSpacing = 1,
        heightOffset = 0,
        numRows = 2
    } = {}){
        super();

        this.imageDim = imageDim
        this.imageSpacing = imageSpacing;
        this.heightOffset = heightOffset;
        this.numRows = numRows;
        this.imageList = []

        //add the board
        let numImagePerRow = Math.ceil(pplList.length / numRows)
        let boardWidth = (imageDim * numImagePerRow) + (imageSpacing * (numImagePerRow + 1));
        console.log("width is " + boardWidth)
        let boardHeight = (imageDim * numRows) + (imageSpacing * (numRows + 1));
        this.boardHeight = boardHeight

        const baordGeo = new THREE.PlaneGeometry(boardWidth, boardHeight);
        const boardMat = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
        this.boardMesh = new THREE.Mesh(baordGeo, boardMat);
        this.add(this.boardMesh)

        //add the images
        let origImageX = - boardWidth / 2 + imageDim / 2 + imageSpacing; 
        let boardTopLeft = new THREE.Vector3(-boardWidth/ 2, boardHeight / 2, 0)
        let currPos = new THREE.Vector3(
            imageSpacing + imageDim / 2,
            -(imageSpacing + imageDim / 2),
            0.1).add(boardTopLeft);
        for(let row = 0 ; row < numRows ; row++){

            for(let col = 0 ; col < numImagePerRow ; col++){
                let idx = col + row * numImagePerRow

                let image = new Image({
                    width: imageDim,
                    height: imageDim,
                    padding: imageSpacing / 2,
                    name: pplList[idx]
                });
                this.add(image)
                image.position.copy(currPos);
                this.imageList.push(image)

                currPos.x += imageSpacing + imageDim
            }

            currPos.y -= (imageSpacing + imageDim)
            currPos.x = origImageX
        }


    }

    getPosition(){
        this.getWorldPosition(this.worldPos)
        return this.worldPos
    }


}