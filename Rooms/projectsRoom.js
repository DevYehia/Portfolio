import { Room } from "./room";

export class ProjectsRoom extends Room{


    //the signs in the room
    signsList;


    constructor(signsList, projectsRoomGroup, roomWidth){
        let startIntensity = 0;
        super(projectsRoomGroup, startIntensity, roomWidth)
        this.signsList = signsList;
    }
}