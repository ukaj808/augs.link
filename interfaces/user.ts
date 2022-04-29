import {UserAddress} from "./user_address.ts";
import {Song} from "./song.ts";

export interface User {
    id: string;
    username: string;
    address: UserAddress;
    queue: Song[];
}

export const createUser = (address: UserAddress): User => {
    return {
        id: crypto.randomUUID(),
        address,
        queue: [],
        username: crypto.randomUUID()
    }
}