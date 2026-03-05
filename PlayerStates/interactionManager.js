import * as THREE from 'three'
import { getDistanceXZ } from '../Utils/MathUtils';
import { keys, isSinglePress } from '../Utils/keyboardUtils'
import { hideOptions, showOptions, reShowOptions } from '../interactionUI';
import { Interactable } from '../Objects/interactable';


export class InteractionManager{

    camLookAt = new THREE.Vector3()
    
    rayCaster = new THREE.Raycaster()

    interactable = null;

    interactableList = []

    interactionKey = 'e'


    /**
     * 
     * @param {Number} dist 
     * @param {THREE.Camera} camera 
     * @param {THREE.Object3D} object 
     */

    
    checkForTrigger(playerPos, camera, object){

        //if interactable is invisible ignore it
        if(!object.visible)return false

        let dist = getDistanceXZ(playerPos, object.hitBox)
        let triggerDistance = object.triggerDistance;


        camera.getWorldDirection(this.camLookAt);
        this.rayCaster.set(playerPos, this.camLookAt);

        //console.log("Awl cond " + (dist <= triggerDistance) + " Tany Cond " + (this.rayCaster.intersectObject(object.hitBox, false).length > 0))
        

        return (dist <= triggerDistance && this.rayCaster.intersectObject(object.hitBox, false).length > 0)

    }

    checkInteraction(player){

        let playerPos = player.position
        let camera = player.camera

        if(player.inDialog || player.inInteraction)return
        
        //check current interactable
        if(this.interactable != null){
            
            //not triggered
            if(!this.checkForTrigger(playerPos, camera, this.interactable)){
                this.interactable.revert()
                this.interactable = null;
            }
            else{
                //interaction handling
                if(isSinglePress(this.interactionKey)){


                    if(this.interactable.showMenu){

                        this.makePlayerFaceInteractable(player, this.interactable)
                       
                        //set updating menu callback
                        this.interactable.updateMenuCallback = () => {
                            hideOptions(false)
                            reShowOptions()
                        }
                        player.inInteraction = true; //to prevent movement
                        showOptions(this.interactable, () => {
                            player.inInteraction = false;
                        })                        
                    }
                    else{
                        this.interactable.interact(0)
                    }

                }

            }
        }

        //no current interactable
        else{
            for(let i in this.interactableList){

                //skip null
                if(this.interactableList[i] == null)continue
            
                if(this.checkForTrigger(playerPos, camera, this.interactableList[i])){
                    this.interactable = this.interactableList[i];
                    this.interactable.trigger()
                    break;
                }
            }
        }

    }

    /**
     * 
     * @param {THREE.Object3D} player 
     * @param {Interactable} interactable 
     */

    makePlayerFaceInteractable(player, interactable){

        let interactableNormal = new THREE.Vector3()
        let interactablePosition = new THREE.Vector3()
        let playerNewPos = new THREE.Vector3();

        //use hitbox as it is easier
        interactable.hitBox.getWorldDirection(interactableNormal).normalize()
        interactable.hitBox.getWorldPosition(interactablePosition)

        playerNewPos.add(interactablePosition).add(interactableNormal.multiplyScalar(interactable.triggerDistance - 0.5))
        playerNewPos.y = player.position.y //don't modify y

        player.position.copy(playerNewPos) //new pos


        player.camera.lookAt(interactablePosition)

        player.camera.rotation.z = 0
        
    }

}