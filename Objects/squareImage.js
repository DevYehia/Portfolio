//this contains base class for all images
import * as THREE from 'three'


export class SquareImage extends THREE.Object3D{


    constructor({

        name = "Alo",
        profile = "404",
        imageName = "TheYous.jpg", //image in textures folder
        width = 2,
        height = 2,
        padding = 1,
        clippingPlanes = []
    } = {}){

        //necessary, don't know why
        super();

        //set params
        this.width = width;
        this.height = height;
        this.friendName = name;
        this.profile = profile;
        this.padding = padding

        //add promise to wait for loading

        this.ready = new Promise((resolve) => {
            this._resolveReady = resolve;
        });

        //add two meshes, the image and the hitbox

        //the image
        const imageTexture = new THREE.TextureLoader().load("textures/" + imageName, this.onLoad.bind(this));
        imageTexture.colorSpace = THREE.SRGBColorSpace


        //the hitbox, it will be the image dimensions + padding to each side
        let hitBoxWidth = width + 2 * padding;
        let hitBoxHeight = height + 2 * padding
        const hitBoxGeo = new THREE.PlaneGeometry(hitBoxWidth, hitBoxHeight);
        const hitBoxMat = new THREE.MeshBasicMaterial({color: 0x99ff99});
        this.hitBoxMesh = new THREE.Mesh(hitBoxGeo, hitBoxMat); //will be an attribute, needed for collision detection
        this.hitBoxMesh.visible = false;
        this.hitBoxMesh.position.z -= 0.1

        this.add(this.hitBoxMesh)


    }

    //modify geometry
    onLoad(texture){

        const aspectRatio = texture.image.width / texture.image.height;
        const imageGeo = new THREE.PlaneGeometry(this.height * aspectRatio, this.height);
        const imageMat = new THREE.MeshBasicMaterial({map: imageTexture, 
            side: THREE.DoubleSide, 
            transparent: true, 
            clippingPlanes: clippingPlanes})
        const imageMesh = new THREE.Mesh(imageGeo, imageMat); 
        this.imageMesh = imageMesh
        this.add(this.imageMesh)

        this._resolveReady(this.imageMesh)
    }
}


