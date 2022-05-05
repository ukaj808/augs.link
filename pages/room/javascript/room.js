const roomId = location.pathname.substr(1);
let userId = localStorage.getItem("userId");
const wsProtocol =  (location.protocol != null && location.protocol === "https:") ? "wss" : "ws";
const roomMainElement = document.getElementById("room");

const publishRoomEvent = (e) => roomMainElement.dispatchEvent(e);
const createUserJoinEvent = () => new CustomEvent('user-join', { detail: elem.dataset.time });
const createUserLeftEvent = () => new CustomEvent('user-left', { detail: elem.dataset.time });
const createAndPublishUserJoinEvent = () => publishRoomEvent(createUserJoinEvent());
const createAndPublishUserLeftEvent = () => publishRoomEvent(createUserLeftEvent());

const connect = () => {
    let ws;
    if (ws) ws.close();
    ws = new WebSocket(`${wsProtocol}://${location.host}/${roomId}/${wsProtocol}`);
    ws.addEventListener("open", (e) => {
        createAndPublishUserJoinEvent();
    });
    ws.addEventListener("close", () => {
        createAndPublishUserLeftEvent();
    });
};

connect();

