//here will be the base for displayed signs in our scene

import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { HOFTitlefont } from '../loader';


export class Sign extends THREE.Object3D{

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

    constructor({signID=null,
        signPic="TheYous.jpg", 
        signName = "Mohamed", 
        signBaseHeight = 2, 
        signBaseWidth = 0.5, 
        signBaseText = "Alo",
        signMainWidth = 5, 
        signMainHeight = 5,
        padding = 4} = {}){

        super()
        this.signBaseHeight = signBaseHeight;
        this.signBaseWidth = signBaseWidth;
        this.signBaseText = signBaseText;
        this.signMainHeight = signMainHeight;
        this.signMainWidth = signMainWidth;
        this.signID = signID


        const baseGeometry = new TextGeometry(signBaseText, {
            font: HOFTitlefont,
            size: 1,
            depth: 0.2
        })//new THREE.PlaneGeometry( signBaseWidth, signBaseHeight);
        const mainGeometry = new THREE.PlaneGeometry( signMainWidth, this.signMainHeight);

        let hitBoxWidth = signMainWidth + 2 * padding;
        let hitBoxHeight = signMainHeight + signBaseHeight + 2 * padding;
        const hitBoxGeo = new THREE.BoxGeometry(hitBoxWidth, hitBoxHeight, 0);
        const hitBoxMat = new THREE.MeshBasicMaterial({visible: false});
        this.hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat); //will be an attribute, needed for collision detection        

        const baseMaterial = new THREE.MeshStandardMaterial( );

        const texture = new THREE.TextureLoader().load( "textures/" + signPic );
        texture.colorSpace = THREE.SRGBColorSpace
        const mainMaterial = new THREE.MeshStandardMaterial( { map: texture} );    

        this.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.main = new THREE.Mesh(mainGeometry, mainMaterial);

        //add text
        this.textSprite = this.addText(signName)
        this.textSprite.visible = false;

        //setup positions

        //base
        let baseSize = new THREE.Vector3()
        this.base.geometry.computeBoundingBox()
        this.base.position.x -= this.base.geometry.boundingBox.getSize(baseSize).x / 2
        this.base.position.y += baseSize.y / 2;
        //this.base.position.z += 1;



        //main
        let mainBaseOffset = 2;
        this.main.position.y += baseSize.y + this.signMainHeight / 2 + mainBaseOffset;

        //name
        this.textSprite.position.y += baseSize.y + this.signMainHeight + mainBaseOffset + 2
        this.textSprite.position.z += 0.5


        //add sign components to object
        this.add(this.base, this.main, this.textSprite, this.hitBox)

    }


    //this sets x and z
    //and sets y relative to the bottom of the base
    setPosition(pos){
        this.position.x = pos.x;
        this.position.z = pos.z;
    }

    //used for 90 degrees rotation of signs
    rotateSign(){
        this.rotateY(Math.PI / 2);
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
        ctx.textBaseline = "top"

        const lines = signName.split("\n");


        const numLines = lines.length

        //get line with max width
        let maxWidth = 0;
        for (let line of lines) {
            const w = ctx.measureText(line).width;
            if (w > maxWidth) maxWidth = w;
        }

        canvas.width = maxWidth
        canvas.height = fontSize * numLines;

        // Redraw because changing canvas size clears it
        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        lines.forEach((line, i) => {
            const lineWidth = ctx.measureText(line).width;
            const x = (canvas.width - lineWidth) / 2;  // CENTER X
            ctx.fillText(line, x, 50 + i * fontSize);
        });

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