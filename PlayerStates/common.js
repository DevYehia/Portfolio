

export const collisionMargin = 0.5;


export const stateInstances = {} 
export let currState = null;

export function changeState(newStateObject){

    //execute on exit
    currState?.onExit?.()
    currState = newStateObject;
    newStateObject.visited = true
    console.log("Now in " + currState.stateName)
}


export const directions = {
  "forward" : "-z",
  "backward" : "+z",
  "left" : "-x",
  "right" : "+x"
}
