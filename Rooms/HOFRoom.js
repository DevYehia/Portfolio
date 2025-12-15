import * as THREE from 'three'
import { Room } from './room'
import { Board } from '../Objects/board';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { HOFTitlefont } from '../loader';

export class HOFRoom extends Room{


    //this is the board where the ppl will be displayed
    board;

    imageDim = 3

    imageSpacing = 0.5;

    constructor(roomWidth, pplList){
        super(0, roomWidth)


        let textGeo = new TextGeometry("BOARD OF FAME", {font: HOFTitlefont, size: 5, depth: 0.2})
        let textMat = new THREE.MeshBasicMaterial({color: 0xffd700});
        this.title = new THREE.Mesh(textGeo, textMat)

        this.board = new Board({
            pplList: pplList,
            imageDim: 4,
            imageSpacing: 1,
            numRows: 2
        })


        this.board.position.x += roomWidth / 2;
        this.board.position.y += this.board.boardHeight / 2
        this.board.position.z -= 30;

        this.title.position.copy(this.board.position)
        let ttlSize = new THREE.Vector3()

        this.title.geometry.computeBoundingBox()
        this.title.position.x -= this.title.geometry.boundingBox.getSize(ttlSize).x / 2
        this.title.position.y += this.board.boardHeight + 1;

        console.log("tt" + JSON.stringify(this.title.position))

        this.add(this.board, this.title)


        //let roomDims = this.getRoomDims();

        //this.addWalls(roomDims.x + 20, roomDims.y + 20, roomDims.z + 20)

    }
}