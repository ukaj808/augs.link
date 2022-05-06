import {Room} from "./room.ts";

export interface RoomEvent {
    eventId: string;
    type: string;
}

export interface UserJoinEvent extends RoomEvent{
    userId: string;
    username: string;
    room: Room;
}

export interface UserLeftEvent extends RoomEvent{
    userId: string;
}