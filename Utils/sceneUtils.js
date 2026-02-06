import * as THREE from 'three'


export function loadTexture(texturePath, width, height, rep){
    //let nearBoundaryCuboidDepth = boundaryCuboidWidth * 2;
    let stoneTexture = new THREE.TextureLoader().load(texturePath)
    stoneTexture.wrapS = THREE.RepeatWrapping
    stoneTexture.wrapT = THREE.RepeatWrapping
    stoneTexture.colorSpace = THREE.SRGBColorSpace
    stoneTexture.repeat.set(rep* Math.ceil(width / height), rep)

    return stoneTexture
}


export function getTextGeoSize(textGeo){
    textGeo.geometry.computeBoundingBox()
    let size = new THREE.Vector3()

    textGeo.geometry.boundingBox.getSize(size)
    console.log("EIh" + JSON.stringify(size))
    return size;
}