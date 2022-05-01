import {ConnInfo, serve} from "https://deno.land/std@0.136.0/http/server.ts";
import {createRoom, joinRoom, Room} from "./interfaces/room.ts";
import {generateResponse, getRemoteAddress} from "./interfaces/http_util.ts";
import {createUser} from "./interfaces/user.ts";

const getRoomPathPattern: URLPattern = new URLPattern({ pathname: "/:id" });
const roomWsConnectPattern: URLPattern = new URLPattern({ pathname: "/:id/wss" });

const rooms: Map<string, Room> = new Map<string, Room>();

const handle = async (req: Request, connInfo: ConnInfo): Promise<Response> => {
    const requestUrl = new URL(req.url);
    const {hostname, port} = getRemoteAddress(connInfo);

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
        else if (getRoomPathPattern.test(req.url)) {
            const roomId: string | undefined = getRoomPathPattern.exec(req.url)?.pathname.groups.id;
            if (roomId == null || !rooms.has(roomId)) {
                return generateResponse("./pages/404/html/404.html", 404, "text/html");
            }
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

        // Web Socket connection request
        //todo: when coming from a room?
        else if (roomWsConnectPattern.test(req.url)) {
            const roomId: string | undefined = roomWsConnectPattern.exec(req.url)?.pathname.groups.id;
            if (roomId == null || !rooms.has(roomId)) {
                return generateResponse("./pages/404/html/404.html", 404, "text/html");
            }
            const room: Room | undefined = rooms.get(roomId);
            if (room == null) {
                return generateResponse("./pages/500/html/500.html", 500, "text/html");
            }
            const { user, response } = createUser(req, connInfo, {
                onJoin() {
                    console.log(`${user.id} joined room ${roomId}`)
                },
                onLeave() {
                    console.log(`${user.id} left room ${roomId}`)
                },
                onMessage() {

                }
            });
            joinRoom(user, room);
            return response;
        }

        // No Content Found...
        return generateResponse("./pages/404/html/404.html", 404, "text/html");

    } else if (req.method === "POST") {
        // Create room + navigate to room page
        if (requestUrl.pathname === "/create-room") {
            const room: Room = createRoom();
            rooms.set(room.id, room);
            return new Response("Creating a room...", {
                status: 303,
                headers: {"content-type": "text/plain", "location": `/${room.id}`},
            });
        }
    }

    // Unrecognized Request
    return generateResponse("./pages/405/html/405.html", 405, "text/html");
}

serve(handle);