import * as env from "../environment"
import { onEnterRoom, onLeaveRoom } from "./triggers"



//here is configuration for each state
//dims : each state is a rectangle with origin at bottom left
//next : contains next states names in each direction
//coll : indicates if this direction is affected by collision or not
//axis : used for something


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
        "axis" : "x",
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
        },
        "onExit" : onLeaveRoom,
        "onFirstVisit" : () => {onEnterRoom("projects")} 
    } ,
    "right": {
        "dims":{
            "origin" : {
                "x" : env.pathWidth / 2,
                "z" : - env.nearBoundaryCuboidDepth / 2
            },
            "width": env.boundaryCuboidWidth,
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
        "dims":{
            "origin" : {
                "x" : -env.pathWidth / 2 - env.boundaryCuboidWidth,
                "z" : - env.nearBoundaryCuboidDepth / 2
            },
            "width": env.boundaryCuboidWidth,
            "depth": env.pathWidth
        },
        "next":{
            "left": "right"
        },
        "coll" : {
            "left": true,
            "right": true,
            "forward": true,
            "backward": true
        },
        "onExit" : onLeaveRoom,
        "onFirstVisit" : () => {onEnterRoom("HOF")}         
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
        "dims":{
            "origin" : {
                "x" : -env.pathWidth / 2 - env.boundaryCuboidWidth,
                "z" : - env.nearBoundaryCuboidDepth / 2
            },
            "width": env.boundaryCuboidWidth,
            "depth": env.pathWidth
        },
        "next":{
            "backward" : "forward"
        },
        "coll" : {
            "left": true,
            "right": true,
            "forward": true,
            "backward": true
        },
        "onExit" : onLeaveRoom,
        "onFirstVisit" : () => {onEnterRoom("myRoom")} 
    } 
}