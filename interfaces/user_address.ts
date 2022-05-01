export interface UserAddress {
    hostname: string;
    port: number;
    socket: WebSocket;
}

export interface UserAddressOptions {
    hostname: string;
    port: number;
    socket: WebSocket;
}

export const createUserAddress = (options: UserAddressOptions): UserAddress => {
    return {
        hostname: options.hostname,
        port: options.port,
        socket: options.socket
    }
}