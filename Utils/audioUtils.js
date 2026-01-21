
export const walkingAudio = new Audio('Sounds/walking.mp3'); // path to your audio file



export function setUpAudio(){
    walkingAudio.loop = true;
}


export function playOneTimeAudio(audioPath){
    let audio = new Audio(audioPath)
    audio.loop = false;
    audio.playbackRate = 2.5
    audio.volume = 0.25
    audio.play()
}