import {Room} from "./room.ts";

export interface RoomEvent {
    eventId: string;
    type: string;
}

export interface FirstUserConnectedEvent extends RoomEvent{
    userId: string;
    username: string;
}

export interface UserLeftEvent extends RoomEvent{
    userId: string;
}