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