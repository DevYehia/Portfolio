import * as env from '../environment'
import { BaseState, StateBorders, StateNext } from './baseState'
import { CollisionBorders, CollisionHandler, StateDoors } from './collision'
import { directions } from './common'

export const states = {
    "start":{
        "borders":{
            "left": -env.pathWidth / 2,
            "right": env.pathWidth / 2,
            "forward": -env.nearBoundaryCuboidDepth / 2,
        },
        "next":{
            "forward" : "fork"
        },
        "coll" : {
            "left": true,
            "right": true,
            "forward": false,
            "backward": true
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
        },
        "coll" : {
            "left": false,
            "right": false,
            "forward": false,
            "backward": false
        }
    },
    "left": {
        "borders":{
            "left": -env.pathWidth / 2 - env.boundaryCuboidWidth,
            "right": -env.pathWidth / 2,
            "forward" : -env.nearBoundaryCuboidDepth / 2 - env.pathWidth,
            "backward" : -env.nearBoundaryCuboidDepth / 2
        },
        "next":{
            "left" : "projects",
            "right" : "fork"
        },
        "coll" : {
            "left": true,
            "right": false,
            "forward": true,
            "backward": true
        }
    },
    "projects": {
        "borders":{
            "right": -env.pathWidth / 2 - env.boundaryCuboidWidth,
        },
        "next":{
            "right" : "left"
        },
        "coll" : {
            "left": true,
            "right": true,
            "forward": true,
            "backward": true
        }
    } ,
    "right": {
        "borders":{
            "left": env.pathWidth / 2 ,
            "right": env.pathWidth / 2 + env.boundaryCuboidWidth,
            "forward" : -env.nearBoundaryCuboidDepth / 2 - env.pathWidth,
            "backward" : -env.nearBoundaryCuboidDepth / 2
        },
        "next":{
            "left" : "fork",
            "right" : "HOF"
        },
        "coll" : {
            "left": false,
            "right": true,
            "forward": true,
            "backward": true
        }
    },
    "HOF": {
        "borders":{
            "left": env.pathWidth / 2 + env.boundaryCuboidWidth,
        },
        "next":{
            "left": "right"
        },
        "coll" : {
            "left": true,
            "right": true,
            "forward": true,
            "backward": true
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
        },
        "coll" : {
            "left": true,
            "right": true,
            "forward": true,
            "backward": false
        }
    },
    "myRoom": {
        "borders":{
            "backward": -env.pathWidth - env.boundaryCuboidWidth - env.nearBoundaryCuboidDepth / 2,
        },
        "next":{
            "backward" : "forward"
        },
        "coll" : {
            "left": true,
            "right": true,
            "forward": true,
            "backward": true
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
        let stateBorders = state.borders
        let stateNext = state.next
        let stateColl = state.coll
        stateInstances[stateName] = new BaseState(stateName)

        //set directions stuff
        let stateBordersObj = new StateBorders()
        let stateNextObj = new StateNext()
        let stateBordersColl = new CollisionBorders()
        let stateDoors = new StateDoors()

        for(let dir in directions){
            stateBordersObj[dir] = (dir in stateBorders) ? stateBorders[dir] : null
            stateNextObj[dir] = (dir in stateNext) ? stateNext[dir] : null
            stateBordersColl[dir] = (stateColl[dir] == true) ? stateBorders[dir] : null
            //stateBordersObj.dir = stateBorders.dir
        }

        stateInstances[stateName].stateBorders = stateBordersObj
        stateInstances[stateName].nextStates = stateNextObj
        stateInstances[stateName].collider = new CollisionHandler(stateBordersColl, stateDoors)        


        if(stateName in interactables)
            stateInstances[stateName].interactableList = interactables[stateName]

        if(stateName in animatables)
            stateInstances[stateName].animatables = animatables[stateName]

    }
}