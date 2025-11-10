//here will be the base for displayed signs in our scene

import * as THREE from 'three';


export class Sign{

    //the sign is composed of two pieces
    //the base which is the bottom part
    //and the main which is the top part having the image

    constructor( signBaseHeight = 2, signBaseWidth = 0.5, signMainWidth = 5, signMainHeight = 5){
        this.signBaseHeight = signBaseHeight;
        this.signBaseWidth = signBaseWidth;
        this.signMainHeight = signMainHeight;
        this.signMainWidth = signMainWidth;


        const baseGeometry = new THREE.BoxGeometry( signBaseWidth, signBaseHeight , 0);
        const mainGeometry = new THREE.BoxGeometry( signMainWidth, this.signMainHeight , 0);
        const baseMaterial = new THREE.MeshBasicMaterial( { color: 0x00ffff} );
        const texture = new THREE.TextureLoader().load( "textures/TheYous.jpg" );
        const mainMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff, map: texture} );    

        this.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.main = new THREE.Mesh(mainGeometry, mainMaterial);

        



        // textMesh.position.x = -45;
        // textMesh.position.y = 0;
        // test.scene.add(textMesh);



        // let textCanvas = document.createElement('canvas');
        // const ctx = textCanvas.getContext('2d');

        // textCanvas.width = 512;
        // textCanvas.height = 512;

        // // // Set text properties
        // // ctx.fillStyle = '#000'; // background
        // //ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ctx.fillStyle = '#fff'; // text color
        // ctx.font = 'bold 128px Arial';
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        // ctx.fillText('Hello, 3D World!', textCanvas.width / 2, textCanvas.height / 2);

        // const canvasTexture = new THREE.CanvasTexture(textCanvas);

        // const textGeometry = new THREE.PlaneGeometry(5, 5);
        //     const textMaterial = new THREE.MeshBasicMaterial({
        //     map: canvasTexture,
        //     side: THREE.DoubleSide,
        //     });

        // this.textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // const material = new THREE.SpriteMaterial({ map: canvasTexture });
        // this.sprite = new THREE.Sprite(material);
        // this.sprite.scale.set(2, 1, 1); // adjust size


    }

    addToScene(scene){
        scene.add(this.base);
        scene.add(this.main);
        //scene.add(this.textMesh)
    }


    //this sets x and z
    //and sets y relative to the bottom of the base
    setPosition(pos){
        this.base.position.copy(pos);
        this.base.position.y += this.signBaseHeight / 2;

        this.main.position.copy(pos);
        this.main.position.y += this.signBaseHeight + this.signMainHeight / 2;

       // this.textMesh.position.copy(pos);
      //  this.textMesh.position.y += this.signBaseHeight + this.signMainHeight + 3;
    }

    //used for 90 degrees rotation of signs
    rotateSign(){
        this.base.rotateY(Math.PI / 2);
        this.main.rotateY(Math.PI / 2);
    }

    changeColor(){
        console.log("change color called")
        this.main.material.color.setHex(0x00ffff);
    }



}