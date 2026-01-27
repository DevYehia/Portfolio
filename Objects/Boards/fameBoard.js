import * as THREE from 'three'
import { SquareImage } from '../squareImage'
import { VarLengthBoard } from './varLengthBoard';
import { makeControls } from '../../Utils/textUtils';


export class Board extends VarLengthBoard{

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
        super({
            imageDim: imageDim,
            imageSpacing: imageSpacing,
            numRows: numRows,
            numImages: pplList.length
        });


        const boardTexture = new THREE.TextureLoader().load("textures/gold.jpg");
        boardTexture.colorSpace = THREE.SRGBColorSpace
        boardTexture.wrapS = THREE.RepeatWrapping;
        boardTexture.wrapT = THREE.RepeatWrapping;

        boardTexture.repeat.set(4,1)

        const baordGeo = new THREE.PlaneGeometry(this.boardWidth, this.boardHeight);
        const boardMat = new THREE.MeshBasicMaterial({color:  0xffd700, side: THREE.DoubleSide, map: boardTexture});
        this.boardMesh = new THREE.Mesh(baordGeo, boardMat);
        this.boardMesh.position.y += heightOffset
        this.add(this.boardMesh)

        //add the images
        let origImageX = - this.boardWidth / 2 + imageDim / 2 + imageSpacing; 
        let boardTopLeft = new THREE.Vector3(-this.boardWidth/ 2, this.boardHeight / 2, 0)
        let currPos = new THREE.Vector3(
            imageSpacing + imageDim / 2,
            -(imageSpacing + imageDim / 2) + heightOffset,
            0.2).add(boardTopLeft);

        let isOddNum = (pplList.length % 2 != 0);


        for(let row = 0 ; row < numRows ; row++){

            if(isOddNum && row == numRows - 1){ //last row
                //center last row
                let numImageInLastRow = this.numImagePerRow - 1;
                let lastRowX =  (this.boardWidth - (numImageInLastRow * imageDim + (numImageInLastRow - 1) * imageSpacing)) / 2;
                currPos.x = -this.boardWidth / 2 + lastRowX + imageDim / 2 
            }

            for(let col = 0 ; col < this.numImagePerRow ; col++){
                let idx = col + row * this.numImagePerRow

                if(idx >= pplList.length){
                    break;
                }

                let image = new SquareImage({
                    width: imageDim,
                    height: imageDim,
                    padding: imageSpacing / 2,
                    name: pplList[idx].name,
                    profile: pplList[idx].profile,
                    imageName: "../textures/friends/" + pplList[idx].image,
                    controls: makeControls(pplList[idx].name, "E - Show Profile")
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