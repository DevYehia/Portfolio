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
    
        // //dialog logic
        // if(inDialog && e.key == 'e' && !e.repeat){
        //     let talkDiv = document.getElementById("talkDiv");
        //     if(currDialogIdx >= currDialog.length){
        //         inDialog = false;
        //         talkDiv.hidden = true;
                
        //     }
        //     else{
        //         animateText(talkDiv, currDialog[currDialogIdx]);
        //         currDialogIdx++;
        //     }        
        // }    
        // let key = e.key
    

        helperKeys[e.key] = true;
    
    });
    window.addEventListener('keyup', e => {helperKeys[e.key] = false});
}

export function resetKeys(){
    console.log("I was called")
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