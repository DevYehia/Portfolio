import * as THREE from 'three'
import {GLTFLoader, FontLoader } from "three/examples/jsm/Addons.js";


export let HOFTitlefont;

/**
 * @type {GLTF}
 */

export let throne;

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
    }
}

export async function loadStuff(){
    const loader = new FontLoader();
    HOFTitlefont = await loader.loadAsync( 'node_modules/three/examples/fonts/helvetiker_regular.typeface.json' );    
    
    for(let textureName in commonTextures){
        let texture = await new THREE.TextureLoader().loadAsync(commonTextures[textureName].image);
        texture.colorSpace = THREE.SRGBColorSpace;
        commonTextures[textureName].texture = texture
    }

    const throneLoader = new GLTFLoader()
    let loadedThrone = await throneLoader.loadAsync('textures/throne/scene.gltf')
    throne = loadedThrone.scene
    
}