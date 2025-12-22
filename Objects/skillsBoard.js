import * as THREE from 'three'
import { SquareImage } from './squareImage'
import { PlaneGeometry } from 'three/webgpu';


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
        const boardMat = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide, clippingPlanes: clippingPlanes});
        this.boardMesh = new THREE.Mesh(baordGeo, boardMat);
        this.add(this.boardMesh)

        //add the images
        let origImageX = - boardWidth / 2 + imageDim / 2 + imageSpacingHorizontal; 
        let origImageY = boardHeight / 2 - (imageSpacingVertical + imageDim / 2)
        let currPos = new THREE.Vector3(origImageX, origImageY, 0.1);

        for(let row = 0 ; row < numRows ; row++){

            let remain_images = pplList.length - row * numImagePerRow
            if(remain_images < numImagePerRow){ //last row
                //center last row
                let numImageInLastRow = numImagePerRow - 1;
                let lastRowX =  (this.boardWidth - (numImageInLastRow * imageDim + (numImageInLastRow - 1) * imageSpacingHorizontal)) / 2;
                currPos.x = -this.boardWidth / 2 + lastRowX + imageDim / 2 
            }

            for(let col = 0 ; col < numImagePerRow ; col++){

                let idx = col + row * numImagePerRow

                if(idx >= pplList.length){
                    continue
                }





                let image = new SquareImage({
                    width: imageDim,
                    height: imageDim,
                    imageName: "../textures/skills/" + pplList[idx],
                    //noHitbox: true,
                    clippingPlanes: clippingPlanes
                });

                this.add(image)
                image.position.copy(currPos);
                this.imageList.push(image)
                console.log("horiz is " + JSON.stringify(currPos))

                currPos.x += imageDim + imageSpacingHorizontal
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