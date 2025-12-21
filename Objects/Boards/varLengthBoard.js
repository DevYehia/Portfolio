import * as THREE from 'three'
import { BaseBoard } from './baseBoard';

export class VarLengthBoard extends BaseBoard{


    constructor({
        imageDim = 2,
        imageSpacing = 2,
        numImages = 0,
        boardName = "Alo",
        numRows = 2
    } = {}){

        super({
            boardName: boardName
        })
        //add the board
        let numImagePerRow = Math.ceil(numImages / numRows)
        this.numImagePerRow = numImagePerRow
        let boardWidth = (imageDim * numImagePerRow) + (imageSpacing * (numImagePerRow + 1));
        this.boardWidth = boardWidth
        console.log("width is " + boardWidth)
        let boardHeight = (imageDim * numRows) + (imageSpacing * (numRows + 1));
        this.boardHeight = boardHeight

    }
}