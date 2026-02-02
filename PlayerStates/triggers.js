//here will be all the functions that are called on visiting certain states

import { onAllRoomsVisitedDialogue } from "../Data/miscDialogues";
import { startDialogue } from "../Utils/dialogUtils";
import { stateInstances } from "./states";
import { player } from "../player";


//will trigger the dialogue telaling the user to go back to the starting area
//and also will spawn the last certificate
export function onLeaveRoom(){

    console.log("Hey am in here man")
    const roomStates = [stateInstances["projects"], stateInstances["HOF"], stateInstances["myRoom"]]

    if(player.triggeredFinalPart) return;

    for(let roomIdx in roomStates){
        if(!roomStates[roomIdx].visited)return; //found a non-visited room 
    }

    //set the final part flag
    player.triggeredFinalPart = true

    //show last certificate
    //TODO

    startDialogue(onAllRoomsVisitedDialogue)

}