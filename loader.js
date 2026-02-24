import * as THREE from 'three'
import {FontLoader } from "three/examples/jsm/Addons.js";
import { skills } from './Data/skills';


export let loadingManager = new THREE.LoadingManager()

export let HOFTitlefont;


export let commonTextures = {
    "door" : {
        "image" : "textures/door.jpg",
        "texture" : null
    },
    "me" : {
        "image" : "textures/me.jpg",
        "texture" : null        
    },
    "wall" : {
        "image" : "textures/innerWall.jpg",
        "texture" : null            
    },
    "roof" : {
        "image" : "textures/Wall.jpg",
        "texture" : null          
    },
    "floor" : {
        "image" : "textures/floor.jpg",
        "texture" : null            
    },
    "gold" : {
        "image" : "textures/gold.jpg",
        //"texture" : null
    }
}



export async function loadStuff(){
    const loader = new FontLoader();
    let textureLoader = new THREE.TextureLoader()
    HOFTitlefont = await loader.loadAsync( 'node_modules/three/examples/fonts/helvetiker_regular.typeface.json' );    
    
    for(let textureName in commonTextures){
        let texture = await textureLoader.loadAsync(commonTextures[textureName].image);
        texture.colorSpace = THREE.SRGBColorSpace;
        commonTextures[textureName].texture = texture
    }

    //load skills textures
    // for(let skillGroupName in skills){
    //     let skillGroup = skills[skillGroupName]

    //     skillGroup["textures"] = []
    //     //loop over every skill and load its texture
    //     skillGroup.list.forEach( async (texturePath, idx)  =>  {
    //         let texture = await textureLoader.loadAsync(texturePath);
    //         skillGroup["textures"].push(texture)
    //     })
    // }

    
}