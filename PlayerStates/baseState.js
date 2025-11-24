import * as THREE from 'three'


export class BaseState{

    //is the user in dialog (no shit)
    isInDialog = false;

    
    //for checking looking at
    camLookAt = new THREE.Vector3()

    rayCaster = new THREE.Raycaster()



}