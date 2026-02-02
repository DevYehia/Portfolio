import { certificates } from "./Data/certificates"
import { renderer } from "./run"



export const pauseStates = {
    NOT_PAUSED: 0,
    PAUSED: 1,
    COLLECTIBLES: 2
}


export let currPauseState = pauseStates.NOT_PAUSED;

//needed HTML Elements
let pauseMenuOptionsDiv = document.getElementById("gameMenu")
let continueButton = document.getElementById("continueBtn")
let collectiblesButton = document.getElementById("collectiblesBtn")
const collectiblesScroller = document.getElementById('collectiblesScroller');
const collectiblesDetail = document.getElementById('collectiblesDetail');
const backButton = document.getElementById("Back")

export function showPauseMenu(e){
    e?.stopPropagation()
    pauseMenuOptionsDiv.classList.remove("closed");
    pauseMenuOptionsDiv.classList.add("open");    
}

function hideCollectiblesMenu(){
    collectiblesContainer.classList.remove("open");
    collectiblesContainer.classList.add("closed")    
}

function showCertificateDetails(certID){
    collectiblesDetail.hidden = false;

    //get detail elements
    const certImage = document.getElementById("selCollImg")
    const certName = document.getElementById("selCollName")
    const certDesc = document.getElementById("selCollDesc")

    let cert = certificates[certID]

    certImage.src = "textures/Certificates/" + cert.image
    certName.innerHTML = cert.name
    certDesc.innerHTML = cert.desc



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


    //setup collectibles detail menu


    //selected onclick
    collectiblesScroller.onclick = (e) => {

        const item = e.target.closest('.collectible-card');
        if (!item || !collectiblesScroller.contains(item)) return; //didnt click on a card

        collectiblesScroller.querySelectorAll('.collectible-card').forEach(i => i.classList.remove('selected')); //clear previous selections

        item.classList.add('selected');

        if(certificates[item.id].collected)
            showCertificateDetails(item.id)

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
        currPauseState = pauseStates.COLLECTIBLES
        pauseMenuOptionsDiv.classList.remove("open")
        pauseMenuOptionsDiv.classList.add("closed");
        collectiblesContainer.classList.remove("closed");
        collectiblesContainer.classList.add("open")
        backButton.hidden = false

        let numCertificates = collectiblesScroller.children.length;
        for(let i = 0 ; i < numCertificates ; i++){
            let certUI = collectiblesScroller.children.item(i)
            let certID = certUI.id

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