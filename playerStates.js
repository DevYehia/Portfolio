//This is the collision module (No Shit)
//Instead of checking each time collision with all objects
//we can check collision objects according to where the user is
//so here will be multiple states, including where the user is, what object to check for collision 
//and what hs next state is

import * as THREE from 'three';
import * as env from './environment';
import { Sign } from './sign';







//this is a helper class
//it is needed because some states need access to camera and others don't
//so we will just pass this object
//don't ask me it is ChatGPT recommendation








export let currState = new StartState();