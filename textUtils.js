
let currIdx = 0;
let currElem;
let originalText;
let intervalHandler;


/** 
*@param  {HTMLElement} divElement
*@param  {string} text
*/
export function animateText(divElement, text){

    currElem = divElement;
    originalText = text;
    let delay = 50
    intervalHandler = setInterval(animateIteration, delay);

}

function animateIteration(){
    currElem.textContent = originalText.slice(0, currIdx);
    currIdx++;
    if(currIdx > originalText.length){
        clearInterval(intervalHandler);
        currIdx = 0;
    }
}