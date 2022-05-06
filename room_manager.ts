import {Room} from "./interfaces/room.ts";
import {User} from "./interfaces/user.ts";
import {RoomEvent, UserJoinEvent, UserLeftEvent} from "./interfaces/room_events.ts";

export class RoomManager {

    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();

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

    public joinRoom(roomId: string, user: User): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        const room = this.rooms.get(roomId) as Room;
        room?.order.push(user.id);
        room?.connectedUsers.push(user);
        const userJoinEvent: UserJoinEvent = {
            eventId: "123",
            type: "UserJoinEvent",
            userId: user.id,
            username: user.username,
            room,
        }
        this.publish(roomId, userJoinEvent);
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

        const userLeftEvent: UserLeftEvent = {
            eventId: "123",
            type: "UserLeftEvent",
            userId: user.id
        }

        if (this.isRoomEmpty(roomId)) this.closeRoom(roomId);
        else this.publish(roomId, userLeftEvent);
    }

    public doesRoomExist(roomId: string): boolean {
        return this.rooms.has(roomId);
    }

    private isRoomEmpty(roomId: string): boolean {
        return this.rooms.get(roomId)?.connectedUsers.length == 0;
    }

    private publish(roomId: string, event: RoomEvent): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        this.rooms.get(roomId)?.connectedUsers.forEach(user => user.address.socket.send(JSON.stringify(event)));
    }

    private closeRoom(roomId: string): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        this.rooms.delete(roomId);
    }

}

