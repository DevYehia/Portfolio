

export function setupPauseMenu(){

    //needed HTML Elements
    let optionsMenuDiv = document.getElementById("menuButton")
    let pauseMenuOptionsDiv = document.getElementById("gameMenu")
    let continueButton = document.getElementById("continueBtn")

    optionsMenuDiv.onclick = (e) => {
        e.stopPropagation()
        pauseMenuOptionsDiv.hidden = false;
        pauseMenuOptionsDiv.classList.add("open");
    }

    pauseMenuOptionsDiv.onclick = (e) => {
        e.stopPropagation()
    }

    continueButton.onclick = (e) => {
        pauseMenuOptionsDiv.classList.remove("open")
    }
}