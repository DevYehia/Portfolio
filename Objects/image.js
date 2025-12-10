//this contains base class for all images
import * as THREE from 'three'


export class Image extends THREE.Object3D{


    constructor({
        width = 5,
        height = 5,
        name = "Alo",
        profile = "404",
        imageName = "TheYous.jpg", //image in textures folder
        padding = 1
    } = {}){

        //necessary, don't know why
        super();

        //set params
        this.width = width;
        this.height = height;
        this.friendName = name;
        this.profile = profile;
        this.padding = padding

        //add two meshes, the image and the hitbox

        //the image
        const imageTexture = new THREE.TextureLoader().load("textures/" + imageName);
        imageTexture.colorSpace = THREE.SRGBColorSpace
        const imageGeo = new THREE.PlaneGeometry(width, height);
        const imageMat = new THREE.MeshBasicMaterial({map: imageTexture, side: THREE.DoubleSide, transparent: true})
        const imageMesh = new THREE.Mesh(imageGeo, imageMat); //no need to access it from outside, not an attribute

        //the hitbox, it will be the image dimensions + padding to each side
        let hitBoxWidth = width + 2 * padding;
        let hitBoxHeight = height + 2 * padding
        const hitBoxGeo = new THREE.PlaneGeometry(hitBoxWidth, hitBoxHeight);
        const hitBoxMat = new THREE.MeshBasicMaterial({visible: false});
        this.hitBoxMesh = new THREE.Mesh(hitBoxGeo, hitBoxMat); //will be an attribute, needed for collision detection

        this.add(imageMesh, this.hitBoxMesh)


    }
}


