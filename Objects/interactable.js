import * as THREE from 'three'
import { hideHint, showHint } from '../interactionUI'
import { handleInteraction } from '../Utils/interactionsUtils';


//interaction info class
export class Interaction{

    type //string used in handleInteraction

    target //the target to be used for interaction

    name //name to be displayed for interaction

    constructor(type, target, name = "default"){
        this.type = type;
        this.target = target;
        this.name = name;
    }
}


export class Interactable extends THREE.Object3D{

    //controlsDiv =  document.getElementById("optionsGrid")

    //the hitbox used when checking for interactions
    hitBox = null

    controls = "mlo"

    //a bool flag to decide whether in interaction show a menu, or just interact
    showMenu = false;

    //title of options menu
    menuTitle = ""

    //passed from interaction manager
    updateMenuCallback;


    triggerDistance = 13

    interactions = []


    constructor({
        showMenu = false,
        menuTitle = ""
    } = {}){
        super()
        this.showMenu = showMenu
        this.menuTitle = menuTitle
    }

    trigger(){
        //this.controlsDiv.hidden = false
        //this.controlsDiv.innerHTML = this.controls
        showHint("E to interact")

    }

    revert(){
        
        hideHint()
    }

    //passed to interactable from upper layer, i.e: interaction manager
    updateOptionsMenu(){
        this.updateMenuCallback()
    }


    //idx is an MANDATORY parameter
    //to work with multiple interactions
    interact(idx){
        
        let interaction = this.interactions[idx]
        handleInteraction(interaction.type, interaction.target)

    }
}