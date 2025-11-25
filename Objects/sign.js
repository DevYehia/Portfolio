//here will be the base for displayed signs in our scene

import * as THREE from 'three';


export class Sign{

    /**
   * @type {THREE.Mesh}
   */
  main;

  //will be used to access projects dictioanry to get its data
  signID;

    /**
    @type {THREE.Sprite}
     */

  textSprite;

    //the sign is composed of two pieces
    //the base which is the bottom part
    //and the main which is the top part having the image

    constructor(signID=null,signPic="TheYous.jpg", signName = "Mohamed", signBaseHeight = 2, signBaseWidth = 0.5, signMainWidth = 5, signMainHeight = 5){
        this.signBaseHeight = signBaseHeight;
        this.signBaseWidth = signBaseWidth;
        this.signMainHeight = signMainHeight;
        this.signMainWidth = signMainWidth;
        this.signID = signID


        const baseGeometry = new THREE.BoxGeometry( signBaseWidth, signBaseHeight , 0);
        const mainGeometry = new THREE.BoxGeometry( signMainWidth, this.signMainHeight , 0);
        const baseMaterial = new THREE.MeshBasicMaterial( { color: 0x00ffff} );

        const texture = new THREE.TextureLoader().load( "textures/" + signPic );
        const mainMaterial = new THREE.MeshStandardMaterial( { map: texture} );    

        this.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.main = new THREE.Mesh(mainGeometry, mainMaterial);

        //add text
        this.textSprite = this.addText(signName)
        this.textSprite.visible = false;


    }

    addToScene(scene){
        scene.add(this.base);
        scene.add(this.main);
        scene.add(this.textSprite)
    }


    addToGroup(group){
        group.add(this.base);
        group.add(this.main);
        group.add(this.textSprite)
    }


    //this sets x and z
    //and sets y relative to the bottom of the base
    setPosition(pos){
        this.base.position.copy(pos);
        this.base.position.y += this.signBaseHeight / 2;

        this.main.position.copy(pos);
        this.main.position.y += this.signBaseHeight + this.signMainHeight / 2;

        this.textSprite.position.copy(pos);
        this.textSprite.position.y += this.signBaseHeight + this.signMainHeight + 1.5;
    }

    //used for 90 degrees rotation of signs
    rotateSign(){
        this.base.rotateY(Math.PI / 2);
        this.main.rotateY(Math.PI / 2);
    }

    changeColor(){
        //console.log("change color called")
        this.main.material.color.setHex(0x00ffff);
    }

    revertColor(){
        this.main.material.color.setHex(0xff00ff);        
    }

    addText(signName){
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const fontSize = 60

        ctx.font = fontSize + "px Arial";

        // Measure the text
        const textWidth = ctx.measureText(signName).width;
        canvas.width = textWidth
        canvas.height = fontSize;

        // Redraw because changing canvas size clears it
        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(signName, 0, canvas.height);

        // Create texture
        const cnvTexture = new THREE.CanvasTexture(canvas);
        //texture.needsUpdate = true;

        // Create sprite material
        const textMaterial = new THREE.SpriteMaterial({ map: cnvTexture, transparent: true });
        const textSprite = new THREE.Sprite(textMaterial);



        // Auto scale based on resolution
        //this is a magic line by chatgpt
        textSprite.scale.set(canvas.width / 50, canvas.height / 50, 1);

        return textSprite
    }

    trigger(){
        this.textSprite.visible = true;
    }

    revert(){
        this.textSprite.visible = false;
    }


}