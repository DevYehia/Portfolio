import * as THREE from 'three'

import { gsap } from 'gsap/gsap-core';

export class CV extends THREE.Object3D{



    constructor(){
        super();

        let CVGeo = new THREE.PlaneGeometry(3, 5);
        let CVMat = new THREE.MeshBasicMaterial(
            {
                color : 0xFFFFFF,
                side: THREE.DoubleSide
            }
        )

        let CVMesh = new THREE.Mesh(CVGeo, CVMat);

        this.add(CVMesh)

    }


    //this method shall make CV
    //approach target pos
    read(targetPos){
        gsap.to(this.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 0.6,
            ease: "power2.out"
        });
    }

    //after finishing reading
    returnToPlace(){

    }


}