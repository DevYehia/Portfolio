import * as THREE from 'three'
import { Room } from './room'
import { FameBoard } from '../Objects/fameBoard';

export class HOFRoom extends Room{


    //this is the board where the ppl will be displayed
    board;

    imageDim = 3

    imageSpacing = 0.5;

    constructor(roomWidth, pplList){
        super(0, roomWidth)

        this.board = new FameBoard({
            pplList: pplList,
            imageDim: 3,
            imageSpacing: 1,
            numRows: 2
        })


        this.board.position.x += roomWidth / 2;
        this.board.position.y += this.board.boardHeight / 2
        this.board.position.z -= 30;

        this.add(this.board)

    }
}