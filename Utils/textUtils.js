


let currIdx = 0;

/**
 * @type {HTMLElement}
 */
let currElem;

/**
 * @type {String}
 */
let originalText;
let intervalHandler;

let onFinishCallback; //callback to be called when done

const delayBetweenLetters = 20


/** 
*@param  {HTMLElement} divElement
*@param  {string} text
*/
export function animateText(divElement, text, onFinish = null){

    //clear previous interval
    clearInterval(intervalHandler);
    currIdx = 0;
    currElem = divElement;
    originalText = text;
    onFinishCallback = onFinish
    intervalHandler = setInterval(animateIteration, delayBetweenLetters);


}

function animateIteration(){
    currElem.innerHTML = originalText.slice(0, currIdx);
    currIdx++;


    if(currIdx > originalText.length){

        clearInterval(intervalHandler);
        currIdx = 0;
        onFinishCallback?.()
        return;
    }


}

//return controls UI HTML String
export function makeControls(title, content){

    return "<p id = 'controlsTitle'>" + title + "</p>" + content;
}