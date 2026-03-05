import { certificates } from "../Data/certificates"

let popUpDiv = document.getElementById("certCollectedPopUp")
let certImageUI = document.getElementById("certImage")

const timeoutPeriodms = 2000;


export function showPopup(certImagePath){


    certImageUI.src = certImagePath
    popUpDiv.hidden = false

    setTimeout(() => {
        popUpDiv.hidden = true
    }, timeoutPeriodms)


}

