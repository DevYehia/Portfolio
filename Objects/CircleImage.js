//this contains base class for all images
import * as THREE from 'three'


export class CircleImage extends THREE.Object3D{


    constructor({

        imageName = "Alo",
        profile = "404",
        imagePath = "TheYous.jpg", //image in textures folder
        radius = 2,
        padding = 1,
        clippingPlanes = []
    } = {}){

        //necessary, don't know why
        super();

        //set params
        this.radius = radius
        this.imageName = imageName
        this.profile = profile;
        this.padding = padding

        //add two meshes, the image and the hitbox

        //the image
        const imageTexture = new THREE.TextureLoader().load(imagePath);
        imageTexture.colorSpace = THREE.SRGBColorSpace
        const imageGeo = new THREE.CircleGeometry(radius);
        const imageMat = new THREE.MeshBasicMaterial({map: imageTexture, 
            side: THREE.DoubleSide, 
            transparent: true, 
            clippingPlanes: clippingPlanes})
        const imageMesh = new THREE.Mesh(imageGeo, imageMat); 
        this.imageMesh = imageMesh

        //the hitbox, it will be the image dimensions + padding to each side
        let hitBoxWidth = radius + 2 * padding;
        let hitBoxHeight = radius + 2 * padding
        const hitBoxGeo = new THREE.PlaneGeometry(hitBoxWidth, hitBoxHeight);
        const hitBoxMat = new THREE.MeshBasicMaterial({color: 0x99ff99});
        this.hitBoxMesh = new THREE.Mesh(hitBoxGeo, hitBoxMat); //will be an attribute, needed for collision detection
        this.hitBoxMesh.visible = false;
        this.hitBoxMesh.position.z -= 0.1

        this.add(imageMesh, this.hitBoxMesh)


    }
}


