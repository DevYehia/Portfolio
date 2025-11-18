
export const KeyStates = {
    NOT_PRESSED: 0,
    SINGLE_PRESS: 1,
    LONG_PRESS: 2
}


export class BaseState{

    //is the user in dialog (no shit)
    isInDialog = false;

    //stores previously stored keys
    prevKeys = {};

    usedKeys = {};



    handleKeys(inputKeys){
        
        for(let key in inputKeys){
            if(this.prevKeys[key] == true && inputKeys[key] == true){
                this.usedKeys[key] = KeyStates.LONG_PRESS;
            }
            else if(this.prevKeys[key] != true && inputKeys[key] == true){
                this.usedKeys[key] = KeyStates.SINGLE_PRESS;
            }
            else{
                this.usedKeys[key] = KeyStates.NOT_PRESSED;
            }
            this.prevKeys[key] = inputKeys[key];
        }        

        return this.usedKeys;

    }


}