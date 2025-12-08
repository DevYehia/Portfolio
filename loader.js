import { FontLoader } from "three/examples/jsm/Addons.js";

export let HOFTitlefont;

export async function loadStuff(){
    const loader = new FontLoader();
    HOFTitlefont = await loader.loadAsync( 'node_modules/three/examples/fonts/helvetiker_regular.typeface.json' );    
    
}