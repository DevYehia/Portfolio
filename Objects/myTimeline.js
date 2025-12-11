import * as THREE from 'three';
import { Image } from './image';
import { TextureLoader } from 'three/webgpu';

export class TimelineBoard extends THREE.Object3D{

    //will contain two things:
    //1) My Image
    //2) My Places


    constructor(){
        super()
        
        let timeLineList = [
            "../textures/Timeline/ASU.png",
            "../textures/Timeline/ejada.png"
        ]



        for(let i = 0 ; i < timeLineList.length ; i++){
            this.addImage(timeLineList[i], i)
        }




    }


    addImage(imagePath, idx){
        new TextureLoader().load(imagePath,
            (texture) => { this.onImageLoad(texture, idx) }
        );
    }

    onImageLoad(texture, idx){
        texture.colorSpace = THREE.SRGBColorSpace
        let aspectRatio = texture.width / texture.height;

        const imageGeo = new THREE.PlaneGeometry(3 * aspectRatio, 3);
        const imageMat = new THREE.MeshBasicMaterial({map: texture, 
            side: THREE.DoubleSide, 
            transparent: true})
        const imageMesh = new THREE.Mesh(imageGeo, imageMat); 

        imageMesh.position.x = idx * 10;
        //add line between them
        const LineGeo = new THREE.PlaneGeometry(4, 0.1);
        const LineMat = new THREE.MeshBasicMaterial({color: 0xffffff});

        const lineMesh = new THREE.Mesh(LineGeo, LineMat)
        lineMesh.position.copy(imageMesh.position).x += 2 + 3 * aspectRatio


        this.add(imageMesh, lineMesh)
    }
}