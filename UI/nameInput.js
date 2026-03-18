let userNameInputContainer = document.getElementById("nameInputContainer")
let userNameInput = document.getElementById("nameInput")
let onEnterNameCallback = null;

export function showInput(){

    userNameInputContainer.hidden = false;
    userNameInput.focus()
}

export function focusOnInput(){
    userNameInput.focus()    
}

export function hideInput(){
    userNameInputContainer.hidden = true;
}


export function setCallback(callBack){
    onEnterNameCallback = callBack;
}


export function onEnterName(){

    let name = userNameInput.value
    if(name.length == 0){
        return;
    }

    hideInput()
    onEnterNameCallback?.(name)


}