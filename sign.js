//here will be the base for displayed signs in our scene

import * as THREE from 'three';

export class Sign{
    signBaseHeight = 10;
    signBaseWidth = 5;
    signPlaceHolderWidth = 20;
    signPlaceHolderHeight = 20;

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
        this.main.position.copy(pos);
        this.main.position.y += this.signBaseHeight / 2 + this.signPlaceHolderHeight / 2;
    }




}