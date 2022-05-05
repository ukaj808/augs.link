import {Room} from "./room.ts";

export interface RoomEvent {
    eventId: string;
    type: string;
    eventDetails: any;
}