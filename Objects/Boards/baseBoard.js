import * as THREE from 'three'

export class BaseBoard extends THREE.Object3D{

    constructor(
        {
            lst = [],
            boardName = ""
        } = {}
    ){
        super()
        this.imageList = lst;
        this.boardName = boardName;
    }
}