//here will be all the functions that are called on visiting certain states

import { onAllRoomsVisitedDialogue } from "../Data/miscDialogues";
import { startDialogue } from "../Utils/dialogUtils";
import { stateInstances } from "./common"
import { player } from "../player";
import { certificates } from "../Data/certificates";
import { envStuff } from "../WorldObjects";
import { addThanksMessage } from "../environment";


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


export function onCollectLastCertificate(scene){

    let hasCollectedAll = true

    for(let certName in certificates){

        if(certName == "Grad")continue; //skip the last certificate
        let cert = certificates[certName]
        
        //obscure
        hasCollectedAll &&= cert.collected

        if(!hasCollectedAll)break;
    }

    if(hasCollectedAll){

        //collect the certificate
        scene.remove(envStuff["finalCertificate"])
        //envStuff["finalCertificate"].collected = true

        //congratulate user with dialogue
        //wait for input on name
        //look at wall
        player.camera.lookAt(envStuff["thanksWall"].position)
        //add thank you message
        addThanksMessage(scene, "Yehia")
    }

}