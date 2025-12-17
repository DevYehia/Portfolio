import * as THREE from 'three'
import { Image } from './image';


export class Collectible extends Image{


    //collectile will have 
    //1) plane with image
    //2) particles
    //3) hitbox
    constructor({
        width = 3,
        height = 1,
        padding = 2,
        particlesColor = 0xffffff
    } = {}){

        
        super({
            width: width,
            height: height,
            padding: padding
        });

    //this.rotateX(- Math.PI / 2)
    this.imageMesh.rotateX(- Math.PI / 2)

    let vertices = []
    for(let i = 0 ; i < 50 ; i++){

        let randX = (Math.random() * this.width) - this.width / 2;
        let randY = Math.random() * 3;
        let randZ = (Math.random() * this.height) - this.height / 2;

        vertices.push(randX, randY, randZ)    

    }
    const particles = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position',
            new THREE.Float32BufferAttribute(
            vertices, 3
            )
    ),
    new THREE.PointsMaterial({ color: particlesColor, size: 0.08 })
    );

    this.particles = particles

    //restore particles rotation
    //particles.rotateX(Math.PI / 2)

    this.add(particles)


    }

    animate(){
            const pos = this.particles.geometry.attributes.position.array;

            for(let i = 1 ; i < pos.length ; i+=3){
            pos[i] += 0.01
            if(pos[i] > 3){
                pos[i] = 0;
            }
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
    }
}