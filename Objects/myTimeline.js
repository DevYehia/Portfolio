import * as THREE from 'three';
import { gsap } from 'gsap/gsap-core';


export class TimelineBoard extends THREE.Object3D {



    clipPlanes = [
        new THREE.Plane(new THREE.Vector3(1, 0, 0), 4),
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), 4)
    ]

    imgList = []
    dateList = []

    skipIntervalHandle = null;


    constructor(){
        super();

        this.timeLineList = [
            { img: "../textures/Timeline/ASU.png", date: "2022" },
            { img: "../textures/Timeline/ejada.png", date: "2023" }
        ];

        this.avatarTexturePath = "../textures/TheYous.jpg";

        this.createBoard();

        //the current viewed image
        this.currImageIdx = 0

        for(let i = 0; i < this.timeLineList.length; i++){
            this.addImage(this.timeLineList[i], i);
        }

    }

    /* ================= BOARD ================= */

    createBoard(){
        const boardGeo = new THREE.PlaneGeometry(30, 12);
        const boardMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.6,
            metalness: 0.1,
            clippingPlanes: this.clipPlanes
        });

        const board = new THREE.Mesh(boardGeo, boardMat);
        board.position.z = -0.1; // behind everything
        this.add(board);
    }

    /* ================= IMAGES ================= */

    addImage(data, idx){
        new THREE.TextureLoader().load(data.img, texture => {
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
        imageMesh.position.set(idx * 8, 0, 0);

        /* ===== Connecting Line ===== */
        if(idx > 0){
            const lineGeo = new THREE.PlaneGeometry(2, 0.08);
            const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, clippingPlanes: this.clipPlanes });
            const line = new THREE.Mesh(lineGeo, lineMat);
            line.position.set(imageMesh.position.x - 4, 0, 0);
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

            console.log("this is " + this)
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
        ctx.font = "28px Arial";
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


    animCntr = 0;
    skipForward = true

    skip(isForward){
        if(isForward && this.currImageIdx >= this.imgList.length){
            return;
        }

        if(!isForward && this.currImageIdx <= 0){
            return;
        }


        if(this.skipIntervalHandle == null){
            this.origAvatarY = this.avatar.position.y;
            this.animCntr = 0;
            this.skipForward = isForward
            this.skipIntervalHandle = setInterval(this.skipHandler.bind(this), 1 / 50)
        }
        //this.otherSkipForward()
    }

    
    skipHandler(){
        let sign = this.skipForward ? -1 : 1;

        let currImage = this.imgList[this.currImageIdx];
        let nextImage = this.skipForward ? this.imgList[this.currImageIdx + 1] : this.imgList[this.currImageIdx - 1];
        

        //console.log("alo" + JSON.stringify(nextImage.position))
        //reached destination
        if((this.skipForward && nextImage.position.x <= 0) || (!this.skipForward && nextImage.position.x >= 0)){
            this.currImageIdx -= sign;
            this.avatar.position.y = this.origAvatarY //prevent offshooting
            clearInterval(this.skipIntervalHandle);
            this.skipIntervalHandle = null;
            return;
        }

        //move board items to left except for avatar
        for(let imgIdx in this.imgList){
            this.imgList[imgIdx].position.x += 1/50 * sign;
        }

        for(let dateIdx in this.dateList){
            this.dateList[dateIdx].position.x += 1/50 * sign;
        }
        this.line.position.x += 1 / 50 * sign;
        this.animCntr += 1/50;
        //jumping animation of avatar
        let diff = Math.abs(nextImage.position.x - currImage.position.x);

        this.avatar.position.y = this.origAvatarY + 2 * Math.sin((Math.PI / diff) * this.animCntr)

    }

    otherSkipForward(){
        if (this.isAnimating) return;
        this.isAnimating = true;

        const currImage = this.imgList[this.currImageIdx];
        const nextImage = this.imgList[this.currImageIdx + 1];

        // How far to move everything so next image reaches x = 0
        const deltaX = nextImage.position.x;

        const tl = gsap.timeline({
            onComplete: () => {
                this.currImageIdx++;
                this.isAnimating = false;
            }
        });

        /* === Move timeline items left === */
        tl.to(
            [...this.imgList.map(img => img.position), this.line.position],
            {
                x: `-=${deltaX}`,
                duration: 1,
                ease: "power2.inOut"
            },
            0
        );

        /* === Avatar jump === */
        tl.to(
            this.avatar.position,
            {
                y: this.origAvatarY + 2,
                duration: 0.5,
                ease: "sine.inOut"
            },
            0
        ).to(
            this.avatar.position,
            {
                y: this.origAvatarY,
                duration: 0.5,
                ease: "sine.inOut"
            },
            0.4
        );
    }

}
