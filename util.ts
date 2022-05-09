import {fromFileUrl} from "https://deno.land/std@0.136.0/path/mod.ts";
import {readableStreamFromReader} from "https://deno.land/std@0.136.0/streams/conversion.ts";

interface TsMapHelper {
    dataType: string;
    value: Array<Object>;
}

function replacer(key: string, value: Object): TsMapHelper | Object {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()),
        };
    } else {
        return value;
    }
}

// Workaround for the fact that js/ts can't serialize/deserialize maps
export function stringify(o: any): string {
    return JSON.stringify(o, replacer);
}

export const generateId = (length: number) => {
    let result           = '';
    const characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const gamertagsTxtFile: string = await Deno.readTextFile("./gamertags/gamertags.txt");
const gamertags: string[] = gamertagsTxtFile.split('\n');
export const generateRandomGamertag = () => gamertags[Math.floor(Math.random() * gamertags.length)];
