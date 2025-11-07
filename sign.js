//here will be the base for displayed signs in our scene

import * as THREE from 'three';

export class Sign{
    signBaseHeight = 2;
    signBaseWidth = 0.5;
    signPlaceHolderWidth = 3;
    signPlaceHolderHeight = 3;

    constructor(scene){
        const baseGeometry = new THREE.BoxGeometry( this.signBaseWidth, this.signBaseHeight , 0);
        const mainGeometry = new THREE.BoxGeometry( this.signPlaceHolderWidth, this.signPlaceHolderHeight , 0);
        const baseMaterial = new THREE.MeshBasicMaterial( { color: 0x00ffff} );
        const texture = new THREE.TextureLoader().load( "textures/TheYous.jpg" );
        const mainMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff, map: texture} );    

        this.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.main = new THREE.Mesh(mainGeometry, mainMaterial);
        scene.add(this.base);
        scene.add(this.main)
    }

    // constructor(baseHeight, baseWidth, mainWidth, mainHeight){
    //     this.signBaseHeight = baseHeight;
    //     this.signBaseWidth = baseWidth;
    //     this.signPlaceHolderWidth = mainWidth;
    //     this.signPlaceHolderHeight = mainHeight;
    // }

    setPosition(pos){
        this.base.position.copy(pos);
        this.base.position.y += this.signBaseHeight / 2;

        this.main.position.copy(pos);
        this.main.position.y += this.signBaseHeight + this.signPlaceHolderHeight / 2;
    }




}