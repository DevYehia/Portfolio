//open link
//open door
//dialog (start/next/skip)
//timeline skip
//skills skip

import { playOneTimeAudio } from "./audioUtils"
import { startDialogue } from "./dialogUtils"

export function handleInteraction(target, interaction){

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
        startDialogue(target)
    },

    "DOOR" : (target) => {
        console.log("called you")
        playOneTimeAudio("Sounds/door.mp3")
        target.toggle()
 
    },

    "NEXT" : (target) => {
        target.next()
    },

    "PREV" : (target) => {
        target.prev()
    }


}