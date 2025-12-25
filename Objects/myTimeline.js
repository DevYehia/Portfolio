import * as THREE from 'three';
import { gsap } from 'gsap/gsap-core';
import { Interactable } from './interactable';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { HOFTitlefont } from '../loader';

export class TimelineBoard extends Interactable {


    isAnimating = false;
    origAvatarY;



    imgList = []
    namesList = []
    dateList = []


    constructor({
        width = 15,
        height = 10,
        timeLineList = [],
        clipPlanes = []
    } = {}){
        super();

        this.width = width
        this.height = height

        this.position.y += height / 2


        //modify clipping planes
        this.clipPlanes = clipPlanes

        this.avatarTexturePath = "../textures/me.jpg";

        this.createBoard(width, height);

        this.addTitle()

        //the current viewed image
        this.currImageIdx = 0

        timeLineList.forEach((item, idx) => {console.log("police");this.addImage(item, idx)});

    }

    addTitle(){
        //set up title
        const ttlGeometry = new TextGeometry("MY JOURNEY", {
            font: HOFTitlefont,
            size : 5,
            depth: 0.2
        })            
        const ttlMat = new THREE.MeshBasicMaterial({color: 0xff0000})
        let ttl = new THREE.Mesh(ttlGeometry, ttlMat);
        ttl.position.y += this.height / 2
        this.ttl = ttl
        this.add(ttl)
        let ttlSize = new THREE.Vector3()
        this.ttl.geometry.computeBoundingBox()
        this.ttl.position.x -= this.ttl.geometry.boundingBox.getSize(ttlSize).x / 2
        this.ttl.position.y += ttlSize.y / (2) //+ 10;
    }

    /* ================= BOARD ================= */

    createBoard(width, height){


        const texture = new THREE.TextureLoader().load( "textures/border3.jpg" );
        texture.colorSpace = THREE.SRGBColorSpace


        const boardGeo = new THREE.PlaneGeometry(width, height);
        const boardMat = new THREE.MeshBasicMaterial({map: texture});

        const board = new THREE.Mesh(boardGeo, boardMat);
        board.position.z = -0.1; // behind everything
        this.add(board);
        this.hitBox = board
    }

    /* ================= IMAGES ================= */

    addImage(data, idx){
        new THREE.TextureLoader().load("../textures/Timeline/" + data.image, texture => {
            this.namesList.push(data.name)
            this.onImageLoad(texture, data.date, idx);
        });
    }

    onImageLoad(texture, date, idx){
        texture.colorSpace = THREE.SRGBColorSpace;
        const aspectRatio = texture.image.width / texture.image.height;

        const imageGeo = new THREE.PlaneGeometry(3 * aspectRatio, 3);
        const imageMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            clippingPlanes: this.clipPlanes
        });

        const imageMesh = new THREE.Mesh(imageGeo, imageMat);
        this.imgList.push(imageMesh)
        imageMesh.position.set(idx * this.width, 0, 0);

        /* ===== Connecting Line ===== */
        if(idx > 0){
            const lineGeo = new THREE.PlaneGeometry( this.width - 8, 0.08);
            const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, clippingPlanes: this.clipPlanes });
            const line = new THREE.Mesh(lineGeo, lineMat);
            line.position.set(imageMesh.position.x - this.width / 2, 0, 0);
            this.line = line
            this.add(line);
        }

        /* ===== Avatar Icon ===== */
        if(idx == 0)
            this.createAvatar(imageMesh);

        /* ===== Date ===== */
        this.createDateLabel(imageMesh, date);

        this.add(imageMesh);
    }

    /* ================= AVATAR ================= */

    createAvatar(parentImage){
        new THREE.TextureLoader().load(this.avatarTexturePath, texture => {
            texture.colorSpace = THREE.SRGBColorSpace;

            const geo = new THREE.CircleGeometry(0.5, 32);
            const mat = new THREE.MeshBasicMaterial({ map: texture });
            const avatar = new THREE.Mesh(geo, mat);

            avatar.position.set(
                parentImage.position.x,
                parentImage.position.y + 2.2,
                0.01
            );

            this.avatar = avatar
            this.origAvatarY = this.avatar.position.y

            this.add(avatar);
        });
    }

    /* ================= DATE LABEL ================= */

    createDateLabel(parentImage, text){
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#ffffff";
        ctx.font = "46px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 128, 32);

        const texture = new THREE.CanvasTexture(canvas);

        const geo = new THREE.PlaneGeometry(2, 0.5);
        const mat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            clippingPlanes: this.clipPlanes
        });

        const dateMesh = new THREE.Mesh(geo, mat);
        dateMesh.position.set(
            parentImage.position.x,
            parentImage.position.y - 2.2,
            0.01
        );
        this.dateList.push(dateMesh)
        this.add(dateMesh);
    }


    next(){
        this.skip(true)
    }

    prev(){
        this.skip(false)
    }

    skip(isForward){
        if(isForward && this.currImageIdx >= this.imgList.length){
            return;
        }

        if(!isForward && this.currImageIdx <= 0){
            return;
        }


        if(this.isAnimating == false){
            this.skipHandler(isForward)
        }
        //this.otherSkipForward()
    }


    skipHandler(isForward){
        if (this.isAnimating) return;
        this.isAnimating = true;

        const currImage = this.imgList[this.currImageIdx];
        const nextImage = isForward ? this.imgList[this.currImageIdx + 1] : this.imgList[this.currImageIdx - 1];

        // How far to move everything so next image reaches x = 0
        const deltaX = nextImage.position.x;
        let inc = (isForward) ? 1 : -1

        const tl = gsap.timeline({
            onComplete: () => {
                this.currImageIdx+=inc;
                this.isAnimating = false;
                this.controls = this.namesList[this.currImageIdx] + "<br>E - Show Brief<br>N - Next<br>P - Previous"
                this.updateDivContent()
            }
        });

        /* === Move timeline items left === */
        tl.to(
            [...this.imgList.map(img => img.position),
             ...this.dateList.map(date => date.position),
             this.line.position
            ],
            {
                x: `-=${deltaX}`,
                duration: 1,
                ease: "none"
            },
            0
        );

        /* === Avatar jump === */
        tl.to(
            this.avatar.position,
            {
                y: this.origAvatarY + 2,
                duration: 0.5,
                ease: "sine.out"
            },
            0
        ).to(
            this.avatar.position,
            {
                y: this.origAvatarY,
                duration: 0.5,
                ease: "sine.in"
            },
            0.5
        );
    }

}
