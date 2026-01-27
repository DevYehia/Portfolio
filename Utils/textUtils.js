
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


/** 
*@param  {HTMLElement} divElement
*@param  {string} text
*/
export function animateText(divElement, text){

    //clear previous interval
    clearInterval(intervalHandler);
    currIdx = 0;
    currElem = divElement;
    originalText = text;
    let delay = 25
    intervalHandler = setInterval(animateIteration, delay);

}

function animateIteration(){
    currElem.innerHTML = originalText.slice(0, currIdx);
    currIdx++;


    if(currIdx > originalText.length){
        clearInterval(intervalHandler);
        currIdx = 0;
        return;
    }


}

//return controls UI HTML String
export function makeControls(title, content){

    return "<p id = 'controlsTitle'>" + title + "</p>" + content;
}