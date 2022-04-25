import {serve} from "https://deno.land/std@0.136.0/http/server.ts";
import {fromFileUrl} from "https://deno.land/std@0.136.0/path/mod.ts";
import {readableStreamFromReader} from "https://deno.land/std@0.136.0/streams/conversion.ts";

async function handler(req: Request): Promise<Response> {
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);

    const url = new URL(req.url);

    console.log("Path:", url.pathname);
    console.log("Query parameters:", url.searchParams);

    const indexPageUrl = new URL("./index.html", import.meta.url);
    const notFoundPageUrl = new URL("./pages/not_found.html", import.meta.url)

    if (req.method === "GET" && url.pathname === "/") {
        const indexPageFile = await Deno.open(fromFileUrl(indexPageUrl));
        return new Response(readableStreamFromReader(indexPageFile), {
            status: 200,
            headers: {"content-type": "text/html",},
        });
    }

    const notFoundPageFile = await Deno.open(fromFileUrl(notFoundPageUrl));
    return new Response(readableStreamFromReader(notFoundPageFile), {
        status: 404,
        headers: {"content-type": "text/html",},
    });
}

serve(handler);