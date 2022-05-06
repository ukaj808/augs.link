import {ConnInfo, serve} from "https://deno.land/std@0.136.0/http/server.ts";
import {generateResponse} from "./interfaces/http_util.ts";
import {createUser} from "./interfaces/user.ts";
import {RoomManager} from "./room_manager.ts";
import {UserJoinEvent, UserLeftEvent} from "./interfaces/room_events.ts";

const profile = Deno.env.get("profile");
const wsProtocol =  (profile != null && profile === "prod") ? "wss" : "ws";
console.log(wsProtocol);

const getRoomPathPattern: URLPattern = new URLPattern({ pathname: "/:id" });
const roomWsConnectPattern: URLPattern = new URLPattern({ pathname: `/:id/${wsProtocol}` });

const roomManager: RoomManager = new RoomManager();

const handle = (req: Request, connInfo: ConnInfo): Promise<Response> => {
    const requestUrl = new URL(req.url);

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
            if (roomId == null || !roomManager.doesRoomExist(roomId)) {
                return generateResponse("./pages/404/html/404.html", 404, "text/html");
            }
            return generateResponse("./pages/room/html/room.html", 200, "text/html");
        } else if (requestUrl.pathname === "/pages/room/javascript/room.js") {
            return generateResponse("./pages/room/javascript/room.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/pages/room/css/room.css") {
            return generateResponse("./pages/room/css/room.css", 200, "text/css");
        }

        // Web Component Sections used in Room

        // Current Section Web Component
        else if (requestUrl.pathname === "/web-components/current/javascript/current_section.js") {
            return generateResponse("./web-components/current/javascript/current_section.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/web-components/current/html/current_section.html") {
            return generateResponse("./web-components/current/html/current_section.html", 200, "text/html");
        } else if (requestUrl.pathname === "/web-components/current/css/current_section.css") {
            return generateResponse("./web-components/current/css/current_section.css", 200, "text/css");
        }

        // Democracy Section Web Component
        else if (requestUrl.pathname === "/web-components/democracy/javascript/democracy_section.js") {
            return generateResponse("./web-components/democracy/javascript/democracy_section.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/web-components/democracy/html/democracy_section.html") {
            return generateResponse("./web-components/democracy/html/democracy_section.html", 200, "text/html");
        } else if (requestUrl.pathname === "/web-components/democracy/css/democracy_section.css") {
            return generateResponse("./web-components/democracy/css/democracy_section.css", 200, "text/css");
        }

        // Drop Section Web Component
        else if (requestUrl.pathname === "/web-components/drop/javascript/drop_section.js") {
            return generateResponse("./web-components/drop/javascript/drop_section.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/web-components/drop/html/drop_section.html") {
            return generateResponse("./web-components/drop/html/drop_section.html", 200, "text/html");
        } else if (requestUrl.pathname === "/web-components/drop/css/drop_section.css") {
            return generateResponse("./web-components/drop/css/drop_section.css", 200, "text/css");
        }

        // Order Section Web Component
        else if (requestUrl.pathname === "/web-components/order/javascript/order_section.js") {
            return generateResponse("./web-components/order/javascript/order_section.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/web-components/order/html/order_section.html") {
            return generateResponse("./web-components/order/html/order_section.html", 200, "text/html");
        } else if (requestUrl.pathname === "/web-components/order/css/order_section.css") {
            return generateResponse("./web-components/order/css/order_section.css", 200, "text/css");
        }

        // Queue Section Web Component
        else if (requestUrl.pathname === "/web-components/queue/javascript/queue_section.js") {
            return generateResponse("./web-components/queue/javascript/queue_section.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/web-components/queue/html/queue_section.html") {
            return generateResponse("./web-components/queue/html/queue_section.html", 200, "text/html");
        } else if (requestUrl.pathname === "/web-components/queue/css/queue_section.css") {
            return generateResponse("./web-components/queue/css/queue_section.css", 200, "text/css");
        }

        else if (requestUrl.pathname === "/images/sample_icon.jpg") {
            return generateResponse("./images/sample_icon.jpg", 200, "image/jpeg");
        }

        // Web Socket connection request
        //todo: when coming from a room?
        else if (roomWsConnectPattern.test(req.url)) {

            const roomId: string | undefined = roomWsConnectPattern.exec(req.url)?.pathname.groups.id;

            if (roomId == null || !roomManager.doesRoomExist(roomId)) {
                return generateResponse("./pages/404/html/404.html", 404, "text/html");
            }

            const { user, response } = createUser(req, connInfo, {
                onJoin: () => roomManager.joinRoom(roomId, user),
                onLeave: () => roomManager.leaveRoom(roomId, user)
            });

            return Promise.resolve(response);
        }

        // No Content Found...
        return generateResponse("./pages/404/html/404.html", 404, "text/html");

    } else if (req.method === "POST") {
        // Create room + navigate to room page
        if (requestUrl.pathname === "/create-room") {
            const roomId: string = roomManager.createRoom();
            return Promise.resolve(new Response("Creating a room...", {
                status: 303,
                headers: {"content-type": "text/plain", "location": `/${roomId}`},
            }));
        }
    }

    // Unrecognized Request
    return generateResponse("./pages/405/html/405.html", 405, "text/html");
}

serve(handle);