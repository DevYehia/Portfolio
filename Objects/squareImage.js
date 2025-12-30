//this contains base class for all images
import * as THREE from 'three'
import { Interactable } from './interactable';


export class SquareImage extends Interactable{


    constructor({

        name = "Alo",
        profile = "404",
        imageName = "TheYous.jpg", //image in textures folder
        width = 2,
        height = 2,
        padding = 1,
        noHitbox = false,
        maintainAspectRatio = true,
        controls = "",
        clippingPlanes = []
    } = {}){

        //necessary, don't know why
        super();
        console.log(imageName)

        this.width = width
        this.height = height;
        this.friendName = name;
        this.profile = profile;
        this.padding = padding
        this.clippingPlanes = clippingPlanes
        this.controls = controls


        //add promise to wait for loading

        this.ready = new Promise((resolve) => {
            this._resolveReady = resolve;
        });

        //add two meshes, the image and the hitbox

        //the image
        if(maintainAspectRatio){
            new THREE.TextureLoader().load("textures/" + imageName, this.onLoad.bind(this));
        }
        else{
            const imageTexture = new THREE.TextureLoader().load("textures/" + imageName);
            imageTexture.colorSpace = THREE.SRGBColorSpace
            const imageGeo = new THREE.PlaneGeometry(this.width, this.height);
            const imageMat = new THREE.MeshBasicMaterial({map: imageTexture, 
                side: THREE.DoubleSide, 
                transparent: true, 
                clippingPlanes: this.clippingPlanes})
            const imageMesh = new THREE.Mesh(imageGeo, imageMat); 
            this.imageMesh = imageMesh
            this.add(this.imageMesh)            
        }


        //the hitbox, it will be the image dimensions + padding to each side
        if(!noHitbox){
            let hitBoxWidth = width + 2 * padding;
            let hitBoxHeight = height + 2 * padding
            const hitBoxGeo = new THREE.PlaneGeometry(hitBoxWidth, hitBoxHeight);
            const hitBoxMat = new THREE.MeshBasicMaterial({color: 0x99ff99});
            this.hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat); //will be an attribute, needed for collision detection
            this.hitBox.visible = false;
            this.hitBox.position.z -= 0.1
            this.add(this.hitBox)
        }

    }

    //modify geometry
    onLoad(texture){
        texture.colorSpace = THREE.SRGBColorSpace
        const aspectRatio = texture.image.width / texture.image.height;
        const imageGeo = new THREE.PlaneGeometry(this.height * aspectRatio, this.height);
        const imageMat = new THREE.MeshBasicMaterial({map: texture, 
            side: THREE.DoubleSide, 
            transparent: true, 
            clippingPlanes: this.clippingPlanes})
        const imageMesh = new THREE.Mesh(imageGeo, imageMat); 
        this.imageMesh = imageMesh
        this.add(this.imageMesh)

        this._resolveReady(this.imageMesh)
    }

    trigger(){
        super.trigger()
        this.hitBox.visible = true
    }

    revert(){
        super.revert()
        this.hitBox.visible = false
    }
}


