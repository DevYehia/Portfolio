// //utils to control movement of camera via mouse
// import { player } from "../player";
// import { currPauseState, pauseStates } from "../pauseMenu";


// export let inPointerLock = false;


// const upClampMargin = Math.PI / 3;
// const horizClampMargin = Math.PI / 4

// //for interactions menu so that user doesnt look away
// let origAngle = 0;
// let renderer;

// export function saveOriginalViewingAngle(){
//     origAngle = player.camera.rotation.y;
// }

// //renderer needed for pointer lock requests
// export function initMouseUtils(inputRenderer){

//     renderer = inputRenderer

//     let camera = player.camera


//     camera.rotation.order = 'YXZ';

//     window.addEventListener('mousemove', e => {
//         if(!inPointerLock || player.inDialog){
//             return;
//         }

//         //if is interaction restrict horizontal movement
//         if(player.inInteraction){
//             let newCamRotY = camera.rotation.y + (-e.movementX * 0.002);
//             let horizClampAngle = origAngle + horizClampMargin
//             if(newCamRotY > -horizClampAngle && newCamRotY > horizClampAngle)
//                 camera.rotation.y += -e.movementX * 0.002;
//         }
//         else{
//             camera.rotation.y += -e.movementX * 0.002;
//         }


//         let newCamRotX = camera.rotation.x + (-e.movementY * 0.002);
//         if(newCamRotX < upClampMargin && newCamRotX > -upClampMargin)
//             camera.rotation.x += -e.movementY * 0.002;


        
//     });

//     document.addEventListener('pointerlockchange', () => {
//       const locked = document.pointerLockElement === renderer.domElement;
//       inPointerLock = locked;
//       document.getElementById("clickDiv").hidden = true;
    
//       if(!locked){
//         resetKeys()
//         showPauseMenu()
//         updatePauseState(pauseStates.PAUSED);
//       }
//       else{
//         updatePauseState(pauseStates.NOT_PAUSED);
    
//       }
      
//       console.log(locked ? 'Pointer locked!' : 'Pointer released');
//     });

//     document.body.addEventListener('click', () => {
//     if(!player.inDialog && currPauseState == pauseStates.NOT_PAUSED)
//         renderer.domElement.requestPointerLock();
//     });

// }