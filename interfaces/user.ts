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
    onMessage(): void;
}

export const createUser = (req: Request, connInfo: ConnInfo, options: UserOptions): { user: User, response: Response } => {
    const { hostname, port } = getRemoteAddress(connInfo);
    const { response, socket } = Deno.upgradeWebSocket(req);

    socket.onopen = options.onJoin;
    socket.onmessage = options.onMessage;
    socket.onclose = options.onLeave;

    return {
        user: {
            id: crypto.randomUUID(),
            address: createUserAddress({
                port: port,
                hostname: hostname,
                socket: socket
            }),
            queue: [],
            username: crypto.randomUUID()
        },
        response
    }
}