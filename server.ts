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
        if (requestUrl.pathname === "/") {
            return generateResponse("./pages/index.html", 200, "text/html");
        } else if (requestUrl.pathname === "/scripts/index.js") {
            return generateResponse("./scripts/index.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/styles/index.css") {
            return generateResponse("./styles/index.css", 200, "text/css");
        } else if (requestUrl.pathname === "/scripts/room.js") {
            return generateResponse("./scripts/room.js", 200, "application/javascript");
        } else if (requestUrl.pathname === "/styles/room.css") {
            return generateResponse("./styles/room.css", 200, "text/css");
        }
    } else if (req.method === "POST") {
        if (requestUrl.pathname === "/create-room") {
            return generateResponse("./pages/room.html", 201, "text/html");
        }
    }

    return generateResponse("./pages/not_found.html", 404, "text/html");
}

serve(handle);