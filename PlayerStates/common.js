import * as THREE from 'three'


export const collisionMargin = 0.5;

export let currState = null;

export function changeState(newStateObject){
    console.log("now in " + newStateObject.stateName + " " + newStateObject.interactableList.length)
    currState = newStateObject;
}


export class PlayerData{

  /** @type {THREE.Vector3} */
  playerPos;

  /** @type {THREE.Camera} */
  camera

  /** @type {THREE.Scene} */
  scene;

  //user input is stored here
  inputKeys;


  constructor(playerPos, camera, scene, inputKeys) {
    this.playerPos = playerPos;
    this.camera = camera;
    this.scene = scene;
    this.inputKeys = inputKeys
  }    
}

export const directions = {
  "forward" : "-z",
  "backward" : "+z",
  "left" : "-x",
  "right" : "+x"
}
