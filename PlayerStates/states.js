import * as env from '../environment'
import { BaseState, StateBorders, StateNext } from './baseState'
import { CollisionBorders, CollisionHandler, StateDoors } from './collision'
import { collisionMargin, directions } from './common'
import { envStuff } from '../environment'

//each state will have origin at its bottom left
export const states = {
    "start":{
        "dims":{
            "origin" : {
                "x" : -env.pathWidth / 2,
                "z" : env.nearBoundaryCuboidDepth / 2
            },
            "width": env.pathWidth,
            "depth": env.nearBoundaryCuboidDepth
        },
        "next":{
            "forward" : "fork"
        },
        "coll" : {
            "left": true,
            "right": true,
            "forward": false,
            "backward": true
        },
        "axis" : "z"
    },
    "fork": {
        "dims":{
            "origin" : {
                "x" : -env.pathWidth / 2,
                "z" : - env.nearBoundaryCuboidDepth / 2
            },
            "width": env.pathWidth,
            "depth": env.pathWidth
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
        },
        "axis" : "all"
    },
    "left": {
        "dims":{
            "origin" : {
                "x" : -env.pathWidth / 2 - env.boundaryCuboidWidth,
                "z" : - env.nearBoundaryCuboidDepth / 2
            },
            "width": env.boundaryCuboidWidth,
            "depth": env.pathWidth
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
        },
        "axis" : "x"
    },
    "projects": {
        "dims":{
            "origin" : {
                "x" : -env.pathWidth / 2 - env.boundaryCuboidWidth,
                "z" : - env.nearBoundaryCuboidDepth / 2
            },
            "width": env.boundaryCuboidWidth,
            "depth": env.pathWidth
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
        "dims":{
            "origin" : {
                "x" : env.pathWidth / 2,
                "z" : - env.nearBoundaryCuboidDepth / 2
            },
            "width": env.boundaryCuboidWidth + 2000,
            "depth": env.pathWidth
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
        },
        "axis" : "x"
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
        "dims":{
            "origin" : {
                "x" : - env.pathWidth / 2,
                "z" : - env.nearBoundaryCuboidDepth / 2 - env.pathWidth
            },
            "width": env.pathWidth,
            "depth": env.boundaryCuboidWidth
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
        },
        "axis" : "z"
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

    //set up room borders
    states["projects"]["dims"]["origin"]["x"] = -env.pathWidth / 2 - env.boundaryCuboidWidth - env.projectsRoom.depth;
    states["projects"]["dims"]["origin"]["z"] = -env.nearBoundaryCuboidDepth / 2 - env.pathWidth / 2 + env.projectsRoom.width / 2;    
    states["projects"]["dims"]["width"] = env.projectsRoom.depth;
    states["projects"]["dims"]["depth"] = env.projectsRoom.width;

    let interactables = {
        "left" : [ env.projectsRoom.door ],
        "projects" : [env.projectsRoom.door, ...env.projectsRoom.signsList],
        "right" : [ env.hallOfFameRoom.door ],
        "HOF" : [env.hallOfFameRoom.door, ...env.hallOfFameRoom.board.imageList, env.hallOfFameRoom.certificate],
        "forward" : [ env.myRoom.door ],
        "myRoom" : [env.myRoom.door, ...env.myRoom.signsList, env.myRoom.skillsBoardGroup, env.myRoom.timeLineBoard, env.myRoom.certificate]
    }

    let animatables = {
        "projects" : [ envStuff["projectsRoom"]["cert"] ],
        "HOF" : [ envStuff["HOFRoom"]["cert"] ],
        "myRoom" : [ envStuff["myRoom"]["cert"] ],        
    }


    let stateDoors = {
        "left": {
            "left" : envStuff["projectsRoom"]["door"]
        } ,
        "projects": {
            "right" : envStuff["projectsRoom"]["door"]
        },
        "right":{
            "right" : envStuff["HOFRoom"]["door"]
        },
        "HOF":{
            "left" : envStuff["HOFRoom"]["door"]
        },
        "forward":{
            "forward" : envStuff["myRoom"]["door"]
        },
        "myRoom":{
            "backward" : envStuff["myRoom"]["door"]
        }
    }




    for(let stateName in states){
        let state = states[stateName]
        if(state == null)continue;
        let stateNext = state.next
        let stateColl = state.coll
        stateInstances[stateName] = new BaseState(stateName, state.axis)


        //set up the state borders
        const originX = state?.dims?.origin?.x ?? 0;
        const originZ = state?.dims?.origin?.z ?? 0;
        const width   = state?.dims?.width   ?? 0;
        const depth   = state?.dims?.depth   ?? 0;

        let collMargin = collisionMargin

        state["borders"] = {}
        state["borders"]["left"] = originX 
        state["borders"]["backward"] = originZ 
        state["borders"]["forward"] = originZ - depth 
        state["borders"]["right"] = originX + width 
        let stateBorders = state.borders

        //set directions stuff
        let stateBordersObj = new StateBorders()
        let stateNextObj = new StateNext()
        let stateBordersColl = new CollisionBorders()
        let stateDoorsObj = new StateDoors()

        for(let dir in directions){
            let sign = (directions[dir].charAt(0) == '+') ? -1 : 1

            stateBordersObj[dir] = (dir in stateBorders) ? stateBorders[dir] : null
            stateNextObj[dir] = (dir in stateNext) ? stateNext[dir] : null
            stateBordersColl[dir] = (stateColl[dir] == true) ? stateBorders[dir] + collMargin * sign : null
            stateDoorsObj[dir] = stateDoors?.[stateName]?.[dir] ?? null
        }
        stateInstances[stateName].axis = state.axis ?? null;
        stateInstances[stateName].stateBorders = stateBordersObj
        stateInstances[stateName].nextStates = stateNextObj
        stateInstances[stateName].collider = new CollisionHandler(stateBordersColl, stateDoorsObj)        


        if(stateName in interactables)
            stateInstances[stateName].interactableList = interactables[stateName]

        if(stateName in animatables)
            stateInstances[stateName].animatables = animatables[stateName]

    }
}