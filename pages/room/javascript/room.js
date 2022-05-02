const roomId = location.pathname.substr(1);
console.log(roomId);

const wsProtocol =  (location.protocol != null && location.protocol === "https:") ? "wss" : "ws";

const connect = () => {
    let ws;
    if (ws) ws.close();
    ws = new WebSocket(`${wsProtocol}://${location.host}/${roomId}/${wsProtocol}`);
    ws.addEventListener("open", () => {
        console.log("open", ws);
    });
    ws.addEventListener("close", () => {
        console.log("close", ws);
    });
};

connect();

