import {serve} from "https://deno.land/std@0.136.0/http/server.ts";
import {fromFileUrl} from "https://deno.land/std@0.136.0/path/mod.ts";
import {readableStreamFromReader} from "https://deno.land/std@0.136.0/streams/conversion.ts";

async function generateResponse(path: string, status: number, contentType: string): Promise<Response> {
    const file = await Deno.open(fromFileUrl(new URL(path, import.meta.url)));
    return new Response(readableStreamFromReader(file), {
        status: status,
        headers: {"content-type": contentType,},
    });
}

function handle(req: Request): Promise<Response> {
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
        else if (requestUrl.pathname === "/pages/room/javascript/room.js") {
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
            return generateResponse("./pages/room/html/room.html", 201, "text/html");
        }
    }

    // Unrecognized Request
    return generateResponse("./pages/405/html/405.html", 405, "text/html");
}

serve(handle);