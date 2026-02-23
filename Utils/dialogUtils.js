import { player } from "../player";
import { currState } from "../PlayerStates/common";
import { animateText } from "./textUtils";

let currDialogList;
let currDialogIdx = 0;
//let controlsDiv = document.getElementById("controlsDiv")
let talkDiv = document.getElementById("talkDiv");

let onFinishDiag = null;

function onFinishLine(){
    //audios["talk"].pause()
}


export function startDialogue(diagList, onFinishDiagCallback = null){

    onFinishDiag = onFinishDiagCallback
    //set dialog in currState
    player.inDialog = true   

    currDialogList = diagList
    currDialogIdx = 0;

    //set available controls
    // controlsDiv.innerHTML = "Q - Next Line<br>X - Skip All"
    // controlsDiv.hidden = false;

    //clear previous dialogues
    talkDiv.innerHTML = ""
    talkDiv.hidden = false;
    animateText(talkDiv, currDialogList[currDialogIdx], onFinishLine);
    currDialogIdx++;
}

export function hasDialogEnded(){
    return currDialogIdx >= currDialogList.length;
}

//returns true if there is a line
//return false if end of dialogue reached
export function nextLine(){
    if(currDialogIdx < currDialogList.length){
        animateText(talkDiv, currDialogList[currDialogIdx], onFinishLine);
        currDialogIdx++;
        return true;   
    }
    else{
        endDialogue()
        return false;
    }
}

export function endDialogue(){
    onFinishLine()
    onFinishDiag?.()
    talkDiv.hidden = true;
    //controlsDiv.innerHTML = currState.interactionManager.interactable?.controls ?? null
    player.inDialog = false   
}