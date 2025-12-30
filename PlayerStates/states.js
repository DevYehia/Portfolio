import * as env from '../environment'
import { BaseState, StateBorders, StateNext } from './baseState'

export const states = {
    "start":{
        "borders":{
            "left": -env.pathWidth / 2,
            "right": env.pathWidth / 2,
            "forward": -env.nearBoundaryCuboidDepth / 2,
        },
        "next":{
            "forward" : "fork"
        }
    },
    "fork": {
        "borders":{
            "left": -env.pathWidth / 2,
            "right": env.pathWidth / 2,
            "forward": -env.nearBoundaryCuboidDepth / 2 - env.pathWidth,
            "backward": -env.nearBoundaryCuboidDepth / 2
        },
        "next":{
            "forward" : "forward",
            "left" : "left",
            "right" : "right",
            "backward" : "start"
        }
    },
    "left": {
        "borders":{
            "left": -env.pathWidth / 2 - env.boundaryCuboidWidth,
            "right": -env.pathWidth / 2,
        },
        "next":{
            "left" : "projects",
            "right" : "fork"
        }
    },
    "projects": {
        "borders":{
            "right": -env.pathWidth / 2 - env.boundaryCuboidWidth,
        },
        "next":{
            "right" : "left"
        }
    } ,
    "right": {
        "borders":{
            "left": env.pathWidth / 2 ,
            "right": env.pathWidth / 2 + env.boundaryCuboidWidth,
        },
        "next":{
            "left" : "fork",
            "right" : "HOF"
        }
    },
    "HOF": {
        "borders":{
            "left": env.pathWidth / 2 + env.boundaryCuboidWidth,
        },
        "next":{
            "left": "right"
        }
    } ,
    "forward": {
        "borders":{
            "forward": -env.pathWidth - env.boundaryCuboidWidth - env.nearBoundaryCuboidDepth / 2,
            "backward": -env.pathWidth  - env.nearBoundaryCuboidDepth / 2,
        },
        "next":{
            "forward" : "myRoom",
            "backward" : "fork"
        }
    },
    "myRoom": {
        "borders":{
            "backward": -env.pathWidth - env.boundaryCuboidWidth - env.nearBoundaryCuboidDepth / 2,
        },
        "next":{
            "backward" : "forward"
        }
    } 
}

export const stateInstances = {} 

export function setupStates(){


    let interactables = {
        "left" : [ env.projectsRoom.door ],
        "projects" : [env.projectsRoom.door, ...env.projectsRoom.signsList, env.projectsRoom.certificate],
        "right" : [ env.hallOfFameRoom.door ],
        "HOF" : [env.hallOfFameRoom.door, ...env.hallOfFameRoom.board.imageList, env.hallOfFameRoom.certificate],
        "forward" : [ env.myRoom.door ],
        "myRoom" : [env.myRoom.door, ...env.myRoom.signsList, env.myRoom.skillsBoardGroup, env.myRoom.timeLineBoard, env.myRoom.certificate]
    }

    let animatables = {
        "projects" : [ env.projectsRoom.certificate ],
        "HOF" : [ env.hallOfFameRoom.certificate ],
        "myRoom" : [ env.myRoom.certificate ],        
    }

    for(let stateName in states){
        let state = states[stateName]
        if(state == null)continue;
        let stateBorders = state.border
        let stateNext = state.next
        stateInstances[stateName] = new BaseState(
            new StateBorders({
                forward: state.borders.forward,
                left: state.borders.left,
                right: state.borders.right,
                backward: state.borders.backward,
            }),
            new StateNext({
                forward: stateNext.forward,
                left: stateNext.left,
                right: stateNext.right,
                backward: stateNext.backward,                
            }),
            stateName
        );
        if(stateName in interactables)
            stateInstances[stateName].interactableList = interactables[stateName]

        if(stateName in animatables)
            stateInstances[stateName].animatables = animatables[stateName]

    }
}