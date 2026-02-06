
// export const walkingAudio = new Audio('Sounds/walking.mp3'); // path to your audio file
const auddioConfigs = {
    "walk" : {
        "src" : "walking.mp3",
        "volume" : 0.5,
        "playbackRate" : 1,
        "loop" : true
    },

    "door" : {
        "src" : "door.mp3",
        "volume" : 0.25,
        "playbackRate" : 2.5,
        "loop" : false        
    },

}

export const audios = {}


export function setUpAudio(){


    for(let audioName in auddioConfigs){
        let configParams = auddioConfigs[audioName]
        audios[audioName] = new Audio()
        let audio = audios[audioName]
        audio.src = "../Sounds/" + auddioConfigs[audioName].src
        for(let configParam in configParams){
  
            if(configParam == "src") continue; //skip src
            let configValue = configParams[configParam]
            console.log("configParam is " + configParam + " val " + configValue)
            audio[configParam] = configValue
        }
        //set src properly

        console.log("audio is " + audio.playbackRate)
    }


}


export function playOneTimeAudio(audioPath){
    let audio = new Audio(audioPath)
    audio.loop = false;
    audio.playbackRate = 2.5
    audio.volume = 0.25
    audio.play()
}

/**        audio.src = "../Sounds/" + audioConfig.src
        audio.volume = audioConfig.volume
        audio["playbackRate"] = audioConfig["playbackRate"]
        audio.loop = audioConfig.loop */