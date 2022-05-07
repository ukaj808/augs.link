import {Room} from "./room.ts";

export interface RoomEvent {
    eventId: string;
    type: string;
}

export interface UserWelcomeEvent extends RoomEvent {
    userId: string;
    username: string;
    roomState: Room;
}

export interface UserJoinEvent extends RoomEvent{
    userId: string;
    username: string;
}

export interface UserLeftEvent extends RoomEvent{
    userId: string;
}