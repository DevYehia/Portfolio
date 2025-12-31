import { certificates } from "./Data/certificates"

export function setupPauseMenu(){

    //needed HTML Elements
    let optionsMenuDiv = document.getElementById("menuButton")
    let pauseMenuOptionsDiv = document.getElementById("gameMenu")
    let continueButton = document.getElementById("continueBtn")
    let collectiblesButton = document.getElementById("collectiblesBtn")
    const collectiblesContainer = document.getElementById('collectiblesContainer');

    optionsMenuDiv.onclick = (e) => {
        e.stopPropagation()
        pauseMenuOptionsDiv.hidden = false;
        console.log("Presseddd")
        pauseMenuOptionsDiv.classList.remove("closed");
        pauseMenuOptionsDiv.classList.add("open");
    }

    pauseMenuOptionsDiv.onclick = (e) => {
        e.stopPropagation()
    }

    continueButton.onclick = (e) => {
        pauseMenuOptionsDiv.classList.remove("open")
        pauseMenuOptionsDiv.classList.add("closed");
    }

    collectiblesButton.addEventListener("click", () => {
        pauseMenuOptionsDiv.classList.remove("open")
        pauseMenuOptionsDiv.classList.add("closed");
        collectiblesContainer.classList.remove("closed");
        collectiblesContainer.classList.add("open")

        for(let certKey in certificates){
            let item = certificates[certKey]
            console.log(JSON.stringify(item))
            let imageToShow = item.collected ? item.image : 'black.png';
            let descToShow = item.collected ? item.description : '??';

            // create UI element
            let card = document.createElement('div');
            card.className = 'collectible-card';

            let img = document.createElement('img');
            img.src = "textures/Certificates/" + imageToShow;

            let desc = document.createElement('p');
            desc.innerText = descToShow;

            card.appendChild(img);
            card.appendChild(desc);
            collectiblesContainer.appendChild(card); 
        } 
    
    })
}