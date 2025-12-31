import { certificates } from "./Data/certificates"
import { renderer } from "./run"

//needed HTML Elements
let optionsMenuDiv = document.getElementById("menuButton")
let pauseMenuOptionsDiv = document.getElementById("gameMenu")
let continueButton = document.getElementById("continueBtn")
let collectiblesButton = document.getElementById("collectiblesBtn")
const collectiblesScroller = document.getElementById('collectiblesScroller');
const backButton = document.getElementById("Back")

function showPauseMenu(e){
    e.stopPropagation()
    pauseMenuOptionsDiv.hidden = false;
    console.log("Presseddd")
    pauseMenuOptionsDiv.classList.remove("closed");
    pauseMenuOptionsDiv.classList.add("open");    
}

function hideCollectiblesMenu(){
    collectiblesContainer.classList.remove("open");
    collectiblesContainer.classList.add("closed")    
}

function showCertificateDetails(){

}


export function setupPauseMenu(){



    //setup collectibles
    for(let certKey in certificates){
        let item = certificates[certKey]
        let imageToShow = item.collected ? item.image : 'black.png';
        let descToShow = item.collected ? item.description : '??';

        // create UI element
        let card = document.createElement('div');
        card.id = certKey;
        card.className = 'collectible-card';

        let img = document.createElement('img');
        img.src = "textures/Certificates/" + imageToShow;

        let desc = document.createElement('p');
        desc.innerText = descToShow;

        card.appendChild(img);
        card.appendChild(desc);

        //setUp click handle for div
       // card.addEventListener("click")



        collectiblesScroller.appendChild(card); 
    } 



    optionsMenuDiv.onclick = (e) => {
        showPauseMenu(e)
    }

    pauseMenuOptionsDiv.onclick = (e) => {
        e.stopPropagation()
    }

    continueButton.onclick = (e) => {
        pauseMenuOptionsDiv.classList.remove("open")
        pauseMenuOptionsDiv.classList.add("closed");
        renderer.domElement.requestPointerLock();
    }

    collectiblesButton.addEventListener("click", () => {
        pauseMenuOptionsDiv.classList.remove("open")
        pauseMenuOptionsDiv.classList.add("closed");
        collectiblesContainer.classList.remove("closed");
        collectiblesContainer.classList.add("open")
        optionsMenuDiv.hidden = true
        backButton.hidden = false

        let numCertificates = collectiblesScroller.children.length;
        for(let i = 0 ; i < numCertificates ; i++){
            let certUI = collectiblesScroller.children.item(i)
            let certID = certUI.id
            console.log("FOund ID " + certID)

            let certificate = certificates[certID]

            if(certificate?.collected){
                certUI.children.item(0).src = "textures/Certificates/" + certificate.image
                certUI.children.item(1).innerHTML = certID
            }

        }
    
    })

    backButton.addEventListener("click", (e) =>{
        hideCollectiblesMenu()
        showPauseMenu(e)
    })

}