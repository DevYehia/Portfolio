//here will be all the functions that are called on visiting certain states

import { onAllRoomsVisitedDialogue, onCollectedLastCertDialogue, roomEnterDialogues } from "../Data/miscDialogues";
import { startDialogue } from "../Utils/dialogUtils";
import { stateInstances } from "./common"
import { player } from "../player";
import { certificates } from "../Data/certificates";
import { envStuff } from "../WorldObjects";
import { addThanksMessage } from "../environment";
import * as nameInput from "../UI/nameInput"
import { animateText } from "../Utils/textUtils";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { HOFTitlefont } from "../loader";

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
    envStuff["finalCertificate"].visible = true
    //TODO

    startDialogue(onAllRoomsVisitedDialogue)

}

let tempScene
export function onCollectLastCertificate(scene){

    tempScene = scene
    let hasCollectedAll = true

    for(let certName in certificates){

        if(certName == "Grad")continue; //skip the last certificate
        let cert = certificates[certName]
        
        //obscure
        hasCollectedAll &&= cert.collected

        if(!hasCollectedAll)break;
    }


    scene.remove(envStuff["finalCertificate"])
    envStuff["finalCertificate"].collected = true


    if(hasCollectedAll){

        startDialogue(onCollectedLastCertDialogue.collectedAll, askForName)
 
        //add thank you message
        addThanksMessage(scene, "Yehia")
    }
    else{
        //collect all certificates
        for(let certName in certificates)certificates[certName].collected = true;

        startDialogue(onCollectedLastCertDialogue.notCollectedAll, askForName)

        //ask for user's name

    }

}

export function onEnterRoom(roomName){
    if(roomName in roomEnterDialogues){
        startDialogue(roomEnterDialogues[roomName])
    }
}


//private function to handle what happens after last certificate dialogue
function askForName(){
    player.inWaitingForName = true //to prevent movement
    nameInput.showInput()
    nameInput.setCallback(
      (userName) => {
        //look at wall
        
        player.camera.lookAt(envStuff["thanksWall"].position)       
        addThanksMessage(tempScene, userName)
        player.inWaitingForName = false;
      }
    ) //when input finishes, start animating his name
}