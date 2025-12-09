import * as THREE from 'three'
import { color } from 'three/tsl';

export class Torch extends THREE.Object3D{


    constructor(){
        super();

        let baseHeight = 3;
        let lightHeight = 1
        let dim = 0.5


        let baseGeo = new THREE.BoxGeometry(dim, baseHeight, dim);
        let baseMat = new THREE.MeshBasicMaterial({color: 0xff0000})

        this.base = new THREE.Mesh(baseGeo, baseMat);

        let lightGeo = new THREE.BoxGeometry(dim, lightHeight , dim);
        let lightMat = new THREE.MeshBasicMaterial({color: 0x00ff00})

        this.light = new THREE.Mesh(lightGeo, lightMat);


        this.base.position.y += baseHeight / 2;
        this.light.position.y += baseHeight + lightHeight / 2;

        this.add(this.base, this.light)



    }


}