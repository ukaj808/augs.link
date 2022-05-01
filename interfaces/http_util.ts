import {ConnInfo} from "https://deno.land/std@0.136.0/http/server.ts";
import {assert} from "https://deno.land/std@0.136.0/_util/assert.ts";
import {fromFileUrl} from "https://deno.land/std@0.136.0/path/mod.ts";
import {readableStreamFromReader} from "https://deno.land/std@0.136.0/streams/conversion.ts";

export const instanceOfNetAddress = (address: Deno.Addr): address is Deno.NetAddr =>  'hostname' in address;

export const getRemoteAddress = (connInfo: ConnInfo): Deno.NetAddr => {
    assert(instanceOfNetAddress(connInfo.remoteAddr), `Invalid connection type: ${typeof connInfo.remoteAddr}`);
    return connInfo.remoteAddr;
}

export const generateResponse = async (path: string, status: number, contentType: string): Promise<Response> => {
    const file = await Deno.open(fromFileUrl(new URL("../".concat(path), import.meta.url)));
    return new Response(readableStreamFromReader(file), {
        status: status,
        headers: {"content-type": contentType,},
    });
}