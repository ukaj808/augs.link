import {Room} from "./interfaces/room.ts";
import {User} from "./interfaces/user.ts";
import {RoomEvent, UserJoinEvent, UserLeftEvent, UserWelcomeEvent} from "./interfaces/room_events.ts";
import {generateId, stringify} from "./util.ts";

export class RoomManager {

    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();
    }

    public createRoom(): string {
        const roomId: string = generateId(7);

        const newRoom: Room = {
            id: roomId,
            vote: {
                numVotedForSkip: 0
            },
            currentSong: null,
            connectedUsers: new Map<string, User>()
        }

        this.rooms.set(roomId, newRoom);

        return roomId;
    }

    public joinRoom(roomId: string, user: User): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        const room = this.rooms.get(roomId) as Room;
        room?.connectedUsers.set(user.id, user);
        const userJoinEvent: UserJoinEvent = {
            eventId: "123",
            type: "UserJoinEvent",
            userId: user.id,
            username: user.username
        }
        const userWelcomeEvent: UserWelcomeEvent = {
            eventId: "123",
            type: "UserWelcomeEvent",
            userId: user.id,
            username: user.username,
            roomState: room
        }
        this.publishTo(roomId, userWelcomeEvent, user.id);
        this.publishAllBut(roomId, userJoinEvent, user.id);
    }

    public leaveRoom(roomId: string, user: User): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        if (!this.isUserInRoom(roomId, user.id)) throw new Error("User doesn't exist in this room");

        const room = this.rooms.get(roomId);

        room?.connectedUsers.delete(user.id);

        const userLeftEvent: UserLeftEvent = {
            eventId: "123",
            type: "UserLeftEvent",
            userId: user.id
        }

        if (this.isRoomEmpty(roomId)) this.closeRoom(roomId);
        else this.publishAll(roomId, userLeftEvent);
    }

    public doesRoomExist(roomId: string): boolean {
        return this.rooms.has(roomId);
    }

    private isUserInRoom(roomId: string, userId: string) {
        return this.rooms.get(roomId)?.connectedUsers.has(userId);
    }

    private isRoomEmpty(roomId: string): boolean {
        return this.rooms.get(roomId)?.connectedUsers.size == 0;
    }

    private publishAll(roomId: string, event: RoomEvent): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        this.rooms.get(roomId)?.connectedUsers.forEach(user => user.address.socket.send(stringify(event)));
    }

    private publishAllBut(roomId: string, event: RoomEvent, userId: string): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        this.rooms.get(roomId)?.connectedUsers.forEach(((user, id) => {
            if (userId !== id) user.address.socket.send(stringify(event))
        }));
    }

    private publishTo(roomId: string, event: RoomEvent, userId: string): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        if (!this.isUserInRoom(roomId, userId)) throw new Error("User doesn't exist in this room");
        this.rooms.get(roomId)?.connectedUsers.get(userId)?.address.socket.send(stringify(event));
    }

    private closeRoom(roomId: string): void {
        if (!this.doesRoomExist(roomId)) throw new Error("Room doesn't exist");
        this.rooms.delete(roomId);
    }

}

