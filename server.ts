import {ConnInfo, serve} from "https://deno.land/std@0.136.0/http/server.ts";
import {fromFileUrl} from "https://deno.land/std@0.136.0/path/mod.ts";
import {readableStreamFromReader} from "https://deno.land/std@0.136.0/streams/conversion.ts";
import {assert} from "https://deno.land/std@0.136.0/_util/assert.ts";
import {createRoom, Room} from "./interfaces/room.ts";
import {createUser, User} from "./interfaces/user.ts";
import {createUserAddress} from "./interfaces/user_address.ts";

const instanceOfNetAddress = (address: Deno.Addr): address is Deno.NetAddr =>  'hostname' in address;

const getRemoteAddress = (connInfo: ConnInfo): Deno.NetAddr => {
    assert(instanceOfNetAddress(connInfo.remoteAddr), `Invalid connection type: ${typeof connInfo.remoteAddr}`);
    return connInfo.remoteAddr;
}

const generateResponse = async (path: string, status: number, contentType: string): Promise<Response> => {
    const file = await Deno.open(fromFileUrl(new URL(path, import.meta.url)));
    return new Response(readableStreamFromReader(file), {
        status: status,
        headers: {"content-type": contentType,},
    });
}

const handle = async (req: Request, connInfo: ConnInfo): Promise<Response> => {
    const requestUrl = new URL(req.url);
    const {hostname, port} = getRemoteAddress(connInfo);
    console.log(hostname);
    console.log(port);

    if (req.method === "GET") {
        // Index Content
        if (requestUrl.pathname === "/") {
            return generateResponse("./pages/home/html/index.html", 200, "text/html");
        } else if (requestUrl.pathname === "/pages/home/javascript/index.js") {
            return generateResponse("./pages/home/javascript/index.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/pages/home/css/index.css") {
            return generateResponse("./pages/home/css/index.css", 200, "text/css");
        }

        // Room Content
        else if (requestUrl.pathname === "/pages/room/html/room.html") {
            return generateResponse("./pages/room/html/room.html", 200, "text/html");
        } else if (requestUrl.pathname === "/pages/room/javascript/room.js") {
            return generateResponse("./pages/room/javascript/room.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/pages/room/css/room.css") {
            return generateResponse("./pages/room/css/room.css", 200, "text/css");
        }

        // Web Component Sections used in Room
        else if (requestUrl.pathname === "/pages/room/javascript/web-components/sections/current_section.js") {
            return generateResponse("./pages/room/javascript/web-components/sections/current_section.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/pages/room/javascript/web-components/sections/democracy_section.js") {
            return generateResponse("./pages/room/javascript/web-components/sections/democracy_section.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/pages/room/javascript/web-components/sections/drop_section.js") {
            return generateResponse("./pages/room/javascript/web-components/sections/drop_section.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/pages/room/javascript/web-components/sections/order_section.js") {
            return generateResponse("./pages/room/javascript/web-components/sections/order_section.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/pages/room/javascript/web-components/sections/queue_section.js") {
            return generateResponse("./pages/room/javascript/web-components/sections/queue_section.js", 200, "application/javascript");
        }

        // No Content Found...
        return generateResponse("./pages/404/html/404.html", 404, "text/html");

    } else if (req.method === "POST") {
        // Create room + navigate to room page
        if (requestUrl.pathname === "/create-room") {
            let room: Room = await createRoom(createUser(createUserAddress(hostname, port)));
            return new Response("Creating a room...", {
                status: 303,
                headers: {"content-type": "text/plain", "location": "/pages/room/html/room.html"},
            });
        }
    }

    // Unrecognized Request
    return generateResponse("./pages/405/html/405.html", 405, "text/html");
}

serve(handle);