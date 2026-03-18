


let currIdx = 0;

let onAnimateLetter //function to call when a letter is animated

/**
 * @type {String}
 */
let originalText;

/**
 * @type {String}
 */
let currText //the text visible in current animation
let intervalHandler;

let onFinishCallback; //callback to be called when done

const delayBetweenLetters = 20


/** 
*@param  {string} text
*/
export function animateText( text, animateLetterCallBack, onFinish = null){

    //clear previous interval
    clearInterval(intervalHandler);
    currIdx = 0;
    onAnimateLetter = animateLetterCallBack
    originalText = text;
    onFinishCallback = onFinish
    intervalHandler = setInterval(animateIteration, delayBetweenLetters);


}

function animateIteration(){
    currText = originalText.slice(0, currIdx);
    onAnimateLetter?.(currText)
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