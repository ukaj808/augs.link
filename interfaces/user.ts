import {createUserAddress, UserAddress} from "./user_address.ts";
import {Song} from "./song.ts";
import {getRemoteAddress} from "./http_util.ts";
import {ConnInfo} from "https://deno.land/std@0.136.0/http/server.ts";

export interface User {
    id: string;
    username: string;
    address: UserAddress;
    queue: Song[];
}

export interface UserOptions {
    onJoin(): void;
    onLeave(): void;
}


export const sendUserPrivateMessage = (user: User, message: string): void => user.address.socket.send(message);
export const sendUserInitialConnectionDetails = (user: User): void =>
    sendUserPrivateMessage(user, JSON.stringify({id: user.id, username: user.username}));

export const createUser = (req: Request, connInfo: ConnInfo, options: UserOptions): { user: User, response: Response } => {
    const { hostname, port } = getRemoteAddress(connInfo);
    const { response, socket } = Deno.upgradeWebSocket(req);
    const userId: string = crypto.randomUUID();

    socket.onopen = options.onJoin;


    socket.onclose = options.onLeave;

    return {
        user: {
            id: userId,
            address: createUserAddress({
                port: port,
                hostname: hostname,
                socket: socket
            }),
            queue: [],
            username: userId
        },
        response
    }
}