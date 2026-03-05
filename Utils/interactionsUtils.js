//open link
//open door
//dialog (start/next/skip)
//timeline skip
//skills skip

import { audios, playOneTimeAudio } from "./audioUtils"
import { startDialogue } from "./dialogUtils"
import { onCollectLastCertificate } from "../PlayerStates/triggers"
import { certificates } from "../Data/certificates"
import { player } from "../player"
import { hideOptions, reShowOptions } from "../interactionUI"
import { showPopup } from "../UI/certificateCollectPopUp"

export function handleInteraction(interaction, target){

    let action = interactions[interaction]

    if(action){
        action(target)
    }

}

export const interactions = {
    "OPEN_LINK" : (target) => {
        window.open(target)
    },

    "OPEN_VIDEO" : (target) => {
        if(target == null){
            startDialogue(["No video here bud"])
        }
        else{
            window.open(target)
        }
    },

    "START_DIAG" : (target) => {
        //dialog started from interaction menu
        if(player.inInteraction){
            hideOptions(false)
            startDialogue(target, reShowOptions)
        }
        else{
            startDialogue(target)
        }

    },

    "DOOR" : (target) => {
        console.log("called you")
        //playOneTimeAudio("Sounds/door.mp3")
        audios["door"].play()
        target.toggle()
 
    },

    "NEXT" : (target) => {
        target.next()
    },

    "PREV" : (target) => {
        target.prev()
    },

    //target[0] --> certificate ID
    //target[1] --> certificate container
    //target[2] --> certificate object
    "CERT" : (target) => {



        certificates[target[0]].collected = true
        target[2].visible = false;

        if(target[0] == "Grad"){
            onCollectLastCertificate(target[1])
        }
        else{ //show popup for all except last certificate
            showPopup("../textures/Certificates/" + certificates[target[0]].image.lowRes)
        }
    }


}

/*
            certificates[certID].collected = true;
            this.remove(this.certificate)

*/