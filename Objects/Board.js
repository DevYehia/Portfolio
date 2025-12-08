import * as THREE from 'three'
import { Image } from './image'


export class Board extends THREE.Object3D{

    worldPos = new THREE.Vector3()


    //ppl list will be dictionary of keys:
    //name: Friend name
    //profile: linkedin profile
    //image: image name in textures/friends folder
    constructor({
        pplList = [],
        imageDim = 3,
        imageSpacing = 1,
        heightOffset = 0,
        numRows = 2
    } = {}){
        super();

        console.log("ppl list is " + JSON.stringify(pplList))

        this.imageDim = imageDim
        this.imageSpacing = imageSpacing;
        this.heightOffset = heightOffset;
        this.numRows = numRows;
        this.imageList = []

        //add the board
        let numImagePerRow = Math.ceil(pplList.length / numRows)
        let boardWidth = (imageDim * numImagePerRow) + (imageSpacing * (numImagePerRow + 1));
        this.boardWidth = boardWidth
        console.log("width is " + boardWidth)
        let boardHeight = (imageDim * numRows) + (imageSpacing * (numRows + 1));
        this.boardHeight = boardHeight

        const boardTexture = new THREE.TextureLoader().load("textures/portrait.jpg");
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

        let isOddNum = (pplList.length % 2 != 0);


        for(let row = 0 ; row < numRows ; row++){

            if(isOddNum && row == numRows - 1){ //last row
                //center last row
                let numImageInLastRow = numImagePerRow - 1;
                let lastRowX =  (boardWidth - (numImageInLastRow * imageDim + (numImageInLastRow - 1) * imageSpacing)) / 2;
                currPos.x = -boardWidth / 2 + lastRowX + imageDim / 2 
            }

            for(let col = 0 ; col < numImagePerRow ; col++){
                let idx = col + row * numImagePerRow

                if(idx >= pplList.length){
                    break;
                }

                let image = new Image({
                    width: imageDim,
                    height: imageDim,
                    padding: imageSpacing / 2,
                    name: pplList[idx].name,
                    profile: pplList[idx].profile,
                    imageName: "../textures/friends/" + pplList[idx].image
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