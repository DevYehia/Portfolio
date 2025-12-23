import * as THREE from 'three'
import { Room } from './room'
import { Board } from '../Objects/Boards/fameBoard';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { HOFTitlefont } from '../loader';
import { handleInteraction } from '../Utils/interactionsUtils';

export class HOFRoom extends Room{


    //this is the board where the ppl will be displayed
    board;

    imageDim = 3

    imageSpacing = 0.5;

    constructor(boardOffset, depth, pplList){
        super({
            depth: depth
        })


        let textGeo = new TextGeometry("BOARD OF FAME", {font: HOFTitlefont, size: 5, depth: 0.2})
        let textMat = new THREE.MeshBasicMaterial({color: 0xffd700});
        this.title = new THREE.Mesh(textGeo, textMat)

        this.board = new Board({
            pplList: pplList,
            imageDim: 4,
            imageSpacing: 1,
            numRows: 2
        })

        //set up image interactions
        for(let imageIdx in this.board.imageList){
            let image = this.board.imageList[imageIdx]
            image.interactions['e'] = () =>{ handleInteraction(image.profile, "OPEN_LINK")}
        }

        //set width and add door
        this.width = this.board.boardWidth + 2 * boardOffset
        this.addDoor()


        this.board.position.x += this.width / 2;
        this.board.position.y += this.board.boardHeight / 2
        this.board.position.z -= this.depth - 1;

        this.title.position.copy(this.board.position)
        let ttlSize = new THREE.Vector3()

        this.title.geometry.computeBoundingBox()
        this.title.position.x -= this.title.geometry.boundingBox.getSize(ttlSize).x / 2
        this.title.position.y += this.board.boardHeight + 1;

        //set height
        this.height = this.title.position.y + 10

        console.log("tt" + JSON.stringify(this.title.position))

        this.add(this.board, this.title)

        this.addWalls("../textures/Wall.jpg", 0xFFD700)

        this.addLight()

        this.addFloor("../textures/fancyFloor.jpg", 6)

    }
}