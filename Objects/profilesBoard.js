import * as THREE from 'three'
import { CircleImage } from './CircleImage'
import { VarLengthBoard } from './Boards/varLengthBoard';


export class ProfilesBoard extends VarLengthBoard{

    worldPos = new THREE.Vector3()


    constructor({
        profilesList = [],
        imageRadius = 3,
        imageSpacing = 3,
        heightOffset = 0,
        numRows = 2,
        clippingPlanes = []
    } = {}){
        super({
            imageDim: 2 * imageRadius,
            imageSpacing: imageSpacing,
            numImages: profilesList.length,
            numRows: numRows

        });



        let boardWidth = this.boardWidth
        let boardHeight = this.boardHeight
        let numImagePerRow = this.numImagePerRow

 

        //add the images
        let origImageX = -this.boardWidth / 2 + imageRadius + imageSpacing; 
        let origImageY = -(imageSpacing + imageRadius) + boardHeight / 2

        let currPos = new THREE.Vector3(origImageX, origImageY , 0.1);

        let currImgIdx = 0;
        let origNumPerRow = numImagePerRow

        for(let row = 0 ; row < numRows ; row++){

            numImagePerRow = origNumPerRow


            if(profilesList.length % 2 != 0 && row == 0){
                let numImageInFirstRow = this.numImagePerRow - 1;
                numImagePerRow = numImageInFirstRow
                let firstRowX =  0;
                currPos.x = firstRowX                
            }

            console.log("curr pos is " + JSON.stringify(currPos))

            for(let col = 0 ;  col < numImagePerRow ; col++){
                let idx = currImgIdx

                if(idx >= profilesList.length){
                    continue
                }

                console.log("profiel is " + profilesList[idx])

                let image = new CircleImage({
                    radius: imageRadius,
                    imagePath: "../textures/profiles/" + profilesList[idx].image,
                    imageName: "../textures/profiles/" + profilesList[idx].name,
                    profile: "../textures/profiles/" + profilesList[idx].profile
                });
                this.add(image)
                image.position.copy(currPos);
                this.imageList.push(image)

                currPos.x += imageSpacing + 2 * imageRadius
                currImgIdx++;
            }

            currPos.y -= (imageSpacing + 2* imageRadius)
            currPos.x = origImageX
        }


    }

    getPosition(){
        this.getWorldPosition(this.worldPos)
        return this.worldPos
    }


}