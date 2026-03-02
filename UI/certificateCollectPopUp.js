import { certificates } from "../Data/certificates"

let popUpDiv = document.getElementById("certCollectedPopUp")
let certImageUI = document.getElementById("certImage")


export function showPopup(certImagePath){


    certImageUI.src = certImagePath
    popUpDiv.hidden = false

    setTimeout(() => {
        popUpDiv.hidden = true
    }, 1500)


}

