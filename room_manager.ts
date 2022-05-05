import {Room} from "./interfaces/room.ts";
import {User} from "./interfaces/user.ts";
import {RoomEvent} from "./interfaces/room_events.ts";

export class RoomManager {

    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();

    }

    public publish(roomId: string, event: RoomEvent): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        this.rooms.get(roomId)?.connectedUsers.forEach(user => user.address.socket.send(JSON.stringify(event)));
    }

    public createRoom(): string {
        const roomId: string = crypto.randomUUID();

        const newRoom: Room = {
            id: roomId,
            order: [],
            vote: {
                numVotedForSkip: 0
            },
            currentSong: null,
            connectedUsers: []
        }

        this.rooms.set(roomId, newRoom);

        return roomId;
    }

    public closeRoom(roomId: string): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        this.rooms.delete(roomId);
    }

    public joinRoom(roomId: string, user: User): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        const room = this.rooms.get(roomId);
        room?.order.push(user.id);
        room?.connectedUsers.push(user);
    }

    public leaveRoom(roomId: string, user: User): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        const room = this.rooms.get(roomId);

        const orderIndex = room?.order.indexOf(user.id, 0);
        if (orderIndex == null) throw new Error("User ID not found in order array");
        if (orderIndex > -1) {
            room?.order.splice(orderIndex, 1);
        }

        const userIndex = room?.connectedUsers.indexOf(user, 0);
        if (userIndex == null) throw new Error("User not found in connected user array");
        if (orderIndex > -1) {
            room?.connectedUsers.splice(userIndex, 1);
        }

    }

    public doesRoomExist(roomId: string): boolean {
        return this.rooms.has(roomId);
    }

    public isRoomEmpty(roomId: string): boolean {
        return this.rooms.get(roomId)?.connectedUsers.length == 0;
    }

}

