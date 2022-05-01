import {User} from "./user.ts";
import {Vote} from "./vote.ts";
import {Song} from "./song.ts";

export interface Room {
    id: string;
    order: string[];
    vote: Vote;
    connectedUsers: User[];
    currentSong: Song | null;
}

export const createRoom = (): Room => {
    return {
        id: crypto.randomUUID(),
        order: [],
        vote: {
            numVotedForSkip: 0
        },
        currentSong: null,
        connectedUsers: []
    }
}


export const joinRoom = (user: User, room: Room): string => {
    room.order.push(user.id);
    room.connectedUsers.push(user);
    return "connected!";
};

export const leaveRoom = (user: User, room: Room): string => {
    room.order.push(user.id);
    room.connectedUsers.push(user);
    return "connected!";
};