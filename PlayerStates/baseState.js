import * as THREE from 'three'


export class BaseState{

    //is the user in dialog (no shit)
    isInDialog = false;

    
    //for checking looking at
    camLookAt = new THREE.Vector3()

    rayCaster = new THREE.Raycaster()

    /**
     * 
     * @param {Number} dist 
     * @param {THREE.Camera} camera 
     * @param {THREE.Object3D} object 
     */

    
    checkForTrigger(dist, triggerDistance, camera, object){

        camera.getWorldDirection(this.camLookAt);
        this.rayCaster.set(camera.position, this.camLookAt);

        return (dist <= triggerDistance && this.rayCaster.intersectObject(object, false).length > 0)

    }



}