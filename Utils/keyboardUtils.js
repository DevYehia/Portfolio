export let keys = {} //contains dictionary key is keyboard key and value is KeyStates

let helperKeys = {}
let prevKeys = {} //true or false only

export const KeyStates = {
    NOT_PRESSED: 0,
    SINGLE_PRESS: 1,
    LONG_PRESS: 2
}

export function initKeyboardUtils(){


    window.addEventListener('keydown', e => {
    
        let key = e.key.toLowerCase()

        //console.log("key is " + key)

        helperKeys[key] = true;
    
    });
    window.addEventListener('keyup', e => {
        let key = e.key.toLowerCase()
        helperKeys[key] = false
        
    });
}

export function resetKeys(){
    prevKeys = {};
    keys = {};
    helperKeys = {}
}

export function processKeyboardInput(){ //must be called in animation frame
    for(let key in helperKeys){
        if(prevKeys[key] == true && helperKeys[key] == true){
            keys[key] = KeyStates.LONG_PRESS;
        }
        else if(prevKeys[key] != true && helperKeys[key] == true){
            keys[key] = KeyStates.SINGLE_PRESS;
        }
        else{
            keys[key] = KeyStates.NOT_PRESSED
        }
        prevKeys[key] = helperKeys[key]
    }
}

export function isPressed(key){
    key = key.toLowerCase()
    return keys[key] == KeyStates.SINGLE_PRESS || keys[key] == KeyStates.LONG_PRESS
}

export function isSinglePress(key){
    key = key.toLowerCase()
    return keys[key] == KeyStates.SINGLE_PRESS
}