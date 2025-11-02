import * as THREE from 'three';

const boundaryCuboidHeight = 5;
const boundaryCuboidWidth = 30;


/**
 * @param {THREE.Scene} scene
 * @param {THREE.BoxGeometry} geometry
 * @param {THREE.MeshBasicMaterial} material
 * @param {THREE.Vector3} position
 */
function addCuboid(scene, geometry, material, position){
    const cuboid = new THREE.Mesh( geometry, material );
    scene.add(cuboid);
    cuboid.position.copy(position)
}



/**
 * @param {THREE.Scene} scene
 */
export function addBoundaryCuboids(scene, pathWidth){

    const geometry = new THREE.BoxGeometry( boundaryCuboidWidth, boundaryCuboidHeight , boundaryCuboidWidth);
    const material = new THREE.MeshBasicMaterial( { color: 0x0000ff} );

    addCuboid(scene, geometry, material, new THREE.Vector3(pathWidth/2 + boundaryCuboidWidth/2, 0 , 0));
    addCuboid(scene, geometry, material, new THREE.Vector3(-pathWidth/2 - boundaryCuboidWidth/2, 0 , 0));    
    addCuboid(scene, geometry, material, new THREE.Vector3(pathWidth/2 + boundaryCuboidWidth/2, 0 , -100));
    addCuboid(scene, geometry, material, new THREE.Vector3(-pathWidth/2 - boundaryCuboidWidth/2, 0 , -100));

}

// module.exports = {
//     addBoundaryCuboids
// }

