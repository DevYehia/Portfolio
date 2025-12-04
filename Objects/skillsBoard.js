import * as THREE from 'three'
import { Image } from './image'


export class SkillsBoard extends THREE.Object3D{

    worldPos = new THREE.Vector3()


    constructor({
        pplList = [],
        imageDim = 3,
        boardWidth = 10,
        boardHeight = 7,
        heightOffset = 0,
        numRows = 2,
        clippingPlanes = []
    } = {}){
        super();

        this.imageDim = imageDim
        this.heightOffset = heightOffset;
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.numRows = numRows;
        this.imageList = []

        //add the board
        let numImagePerRow = Math.ceil(pplList.length / numRows)
        let imageSpacingHorizontal = (boardWidth - imageDim * numImagePerRow) / (numImagePerRow + 1);
        let imageSpacingVertical = (boardHeight - imageDim * numRows) / (numRows + 1);

        const baordGeo = new THREE.PlaneGeometry(boardWidth, boardHeight);
        const boardMat = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide, clippingPlanes: clippingPlanes});
        this.boardMesh = new THREE.Mesh(baordGeo, boardMat);
        this.add(this.boardMesh)

        //add the images
        let origImageX = - boardWidth / 2 + imageDim / 2 + imageSpacingHorizontal; 
        let boardTopLeft = new THREE.Vector3(-boardWidth/ 2, boardHeight / 2, 0)
        let currPos = new THREE.Vector3(
            imageSpacingHorizontal + imageDim / 2,
            -(imageSpacingVertical + imageDim / 2),
            0.1).add(boardTopLeft);
        for(let row = 0 ; row < numRows ; row++){

            for(let col = 0 ; col < numImagePerRow ; col++){
                let idx = col + row * numImagePerRow

                let image = new Image({
                    width: imageDim,
                    height: imageDim,
                    name: pplList[idx]
                });
                this.add(image)
                image.position.copy(currPos);
                this.imageList.push(image)

                currPos.x += imageSpacingHorizontal + imageDim
            }

            currPos.y -= (imageSpacingVertical + imageDim)
            currPos.x = origImageX
        }


    }

    getPosition(){
        this.getWorldPosition(this.worldPos)
        return this.worldPos
    }


}