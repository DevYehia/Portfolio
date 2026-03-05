const hint = document.getElementById("interactHint");
const optionsMenu = document.getElementById("optionsGrid")
const optionsTitle = document.getElementById("optionsTitle")
const optionsContainer = document.getElementById("optionsContainer")

//2d array
//representing how the interactions are in the grid
let interactionsArray = []

let interactable; // the interactable object that opened the menu

let currSelectedRow = 0;
let currSelectedColumn = 0;
let selectedClassName = "optionSelected"

let selectedMarker = "x "
let quitOptionID = "Quit"

let onQuitCallback; // function to be called on callback

export function showHint(text) {
  hint.textContent = text;
  hint.style.opacity = "1";
  hint.style.transform = "translate(-50%, 30px)";
}

export function hideHint() {
  hint.style.opacity = "0";
  hint.style.transform = "translate(-50%, 25px)";
}

//options is a list of options
export function showOptions(inputInteractable, inputOnQuitCallback){

    hideHint()

    onQuitCallback = inputOnQuitCallback

    interactable = inputInteractable
    let options = interactable.interactions.map((int) => int.name)

    //add Quit Option
    options.push("Quit")

    //Reset curr selected
    currSelectedRow = 0
    currSelectedColumn = 0

    //reset interactions array
    for(let row = 0 ; row < interactionsArray.length ; row++){
        for(let col = 0 ; col < interactionsArray[0].length ; col++){
            let elem = interactionsArray[row][col]
            if(elem)
            optionsMenu.removeChild(elem)
        }
    }
    interactionsArray = []

    let numRows;
    let numColumns; 
    //set rows and columns
    //align as one row if few options
    if(options.length < 4){
        numRows = 1
        numColumns = options.length 
    }
    else{
        numRows = Math.ceil(options.length / 2)
        numColumns = 2
    }


    console.log("El options " + options)

    //options title
    optionsTitle.innerHTML = inputInteractable.menuTitle
    optionsTitle.style.gridColumn = `1 / span ${numColumns}` //span all columns
    

    //set up options menu
    optionsContainer.hidden = false
    optionsMenu.innerHTML = null
    optionsMenu.style.gridTemplateRows = `repeat(${numRows}, 1fr)`
    optionsMenu.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`

    for(let row = 0 ; row < numRows ; row++){
        interactionsArray.push([])
        for(let col = 0 ; col < numColumns ; col++){
            let optIdx = col + 2 * row
            if(optIdx >= options.length){ //elements ran out

                //center last element
                interactionsArray[row][col-1].style.gridColumn = `1 / span ${numColumns}`
                continue
            }
            let option = document.createElement("div")
            option.classList.add("centered")
            option.innerHTML = options[optIdx]
            optionsMenu.appendChild(option)
            interactionsArray[row].push(option)

            //add unique id for quit option
            if(options[optIdx] == "Quit"){
                option.id = quitOptionID
            }
        }
    }

    //the selected element
    let selectedElem = interactionsArray[currSelectedRow][currSelectedColumn]
    selectedElem.innerHTML = selectedMarker + selectedElem.innerHTML

    selectedElem.classList.add(selectedClassName)

}

//param is boolean
//because on updating menu we dont need to call callback

export function hideOptions(executeQuitCallback = true){
    optionsContainer.hidden = true    
    if(executeQuitCallback)onQuitCallback()
}

//basic function, doesnt reset anything
//just shows the options menu
//useful when hiding and showing options menu mid interaction
export function reShowOptions(){
    optionsTitle.innerHTML = interactable.menuTitle
    optionsContainer.hidden = false
}

function selectElement(elem){
    elem.innerHTML = selectedMarker + elem.innerHTML
    elem.classList.add(selectedClassName)    
}

function unSelectElem(elem){
    elem.innerHTML = elem.innerHTML.replace(selectedMarker, "")
    elem.classList.remove(selectedClassName)
}

//+1 move right
export function optionsMoveRight(){
    moveColumn(1)
}

//-1 move left
export function optionsMoveLeft(){
    moveColumn(-1)
}

function moveColumn(moveDirSign){

    let numColumns = interactionsArray[currSelectedRow].length
    if(currSelectedColumn + moveDirSign >= numColumns 
        ||
       currSelectedColumn + moveDirSign < 0
    )return; //out of bounds


    //remove the x marker
    let currSelectedElem = interactionsArray[currSelectedRow][currSelectedColumn]
    unSelectElem(currSelectedElem)

    currSelectedColumn += moveDirSign
    currSelectedElem = interactionsArray[currSelectedRow][currSelectedColumn]
    selectElement(currSelectedElem)
    

}

//+1 move right
export function optionsMoveUp(){
    moveRow(-1)
}

//-1 move left
export function optionsMoveDown(){
    moveRow(1)
}

function moveRow(moveDirSign){

    let numRows = interactionsArray.length
    if(currSelectedRow + moveDirSign >= numRows 
        ||
       currSelectedRow + moveDirSign < 0
    )return; //out of bounds

    let nextRow = currSelectedRow + moveDirSign



    //remove the x marker
    let currSelectedElem = interactionsArray[currSelectedRow][currSelectedColumn]
    unSelectElem(currSelectedElem)


    //bottom array may not have same number of elements as top array
    //handle this
    if(currSelectedColumn >= interactionsArray[nextRow].length){
        currSelectedColumn = interactionsArray[nextRow].length - 1 //nearest elem
    }

    currSelectedRow += moveDirSign
    currSelectedElem = interactionsArray[currSelectedRow][currSelectedColumn]
    selectElement(currSelectedElem)
    

}

export function executeInteraction(){

    let currOption = interactionsArray[currSelectedRow][currSelectedColumn]

    //quit option
    //special treatment
    if(currOption.id == quitOptionID){
        hideOptions()
        return;
    }

    //execute the interaction according to idx
    let interactionIdx = currSelectedRow * 2 + currSelectedColumn;
    interactable.interact(interactionIdx)

}