import { currState } from "../PlayerStates/common";
import { animateText } from "./textUtils";

let currDialogList;
let currDialogIdx = 0;
let controlsDiv = document.getElementById("controlsDiv")
let talkDiv = document.getElementById("talkDiv");

export function startDialogue(diagList){

    //set dialog in currState
    currState.isInDialog = true;

    currDialogList = diagList
    currDialogIdx = 0;

    //set available controls
    controlsDiv.innerHTML = "Q - Next Line<br>X - Skip All"
    controlsDiv.hidden = false;

    //clear previous dialogues
    talkDiv.innerHTML = ""
    talkDiv.hidden = false;

    animateText(talkDiv, currDialogList[currDialogIdx]);
    currDialogIdx++;
}

export function hasDialogEnded(){
    return currDialogIdx >= currDialogList.length;
}

//returns true if there is a line
//return false if end of dialogue reached
export function nextLine(){
    if(currDialogIdx < currDialogList.length){
        animateText(talkDiv, currDialogList[currDialogIdx]);
        currDialogIdx++;
        return true;   
    }
    else{
        talkDiv.hidden = true;
        controlsDiv.hidden = true;
        currState.isInDialog = false;  
        return false;
    }
}

export function endDialogue(){
    talkDiv.hidden = true;
    controlsDiv.hidden = true; 
    currState.isInDialog = false;   
}