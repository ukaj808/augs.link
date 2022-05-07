import {User} from "./user.ts";
import {Vote} from "./vote.ts";
import {Song} from "./song.ts";

export interface Room {
    id: string;
    vote: Vote;
    connectedUsers: Map<string, User>;
    currentSong: Song | null;
}