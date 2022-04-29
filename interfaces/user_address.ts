import {User} from "./user.ts";

export interface UserAddress {
    hostname: string;
    port: number;
}

export const createUserAddress = (hostname: string, port: number): UserAddress => {
    return {
        hostname,
        port
    }
}