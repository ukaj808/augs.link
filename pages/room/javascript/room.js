const roomId = location.pathname.substr(1);
const wsProtocol = (location.protocol != null && location.protocol === "https:") ? "wss" : "ws";
const roomMainElement = document.getElementById("room");
let userId;
let username;

const publishRoomEvent = (e) => roomMainElement.dispatchEvent(e);
const createUserJoinEvent = () => new CustomEvent('user-join',
    {detail: {userId: userId, username: username}});
const createUserLeftEvent = () => new CustomEvent('user-left',
    {detail: {userId: userId, username: username}});
const createAndPublishUserJoinEvent = () => publishRoomEvent(createUserJoinEvent());
const createAndPublishUserLeftEvent = () => publishRoomEvent(createUserLeftEvent());
const initUserId = (str) => userId = str;
const initUsername = (str) => username = str;
const handleFirstUserConnectedEvent = (data) => {
    initUserId(data?.userId);
    initUsername(data?.username);
    createAndPublishUserJoinEvent();
}

const roomEventHandler = ({data}) => {
    let parsedMessage = JSON.parse(data);

    switch (parsedMessage?.type) {
        case "FirstUserConnectedEvent":
            handleFirstUserConnectedEvent();
            break;
        default:
            console.error("Unrecognized Event!");
            break;
    }

}


const connect = () => {
    let ws;
    if (ws) ws.close();
    ws = new WebSocket(`${wsProtocol}://${location.host}/${roomId}/${wsProtocol}`);
    ws.addEventListener("message", roomEventHandler);
};

connect();

