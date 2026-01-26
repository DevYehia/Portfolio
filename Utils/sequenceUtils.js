


//a sequence is a 2D array
//each element has two things executable and delay

let currSeqIdx = -1;
let currSequence = []
let sequenceHandler = null;

export function startSequence(sequence){
    currSequence = sequence
    currSeqIdx = -1;
    moveSequence()
}


function moveSequence(){
    currSeqIdx++;

    if(currSeqIdx >= currSequence.length){
        return; //do nothing
    }
    setTimeout(moveSequence, currSequence[currSeqIdx][1])
    executeSequence()

}

function executeSequence(){
    currSequence[currSeqIdx][0]()
}
