const roomId = location.pathname.substr(1);
const wsProtocol = (location.protocol != null && location.protocol === "https:") ? "wss" : "ws";
const roomMainElement = document.getElementById("room");

const publishRoomEvent = (e) => roomMainElement.dispatchEvent(e);
const createUserJoinEvent = (eventData) => new CustomEvent('user-join',
    {detail: {userId: eventData.userId, username: eventData.username}});
const createUserLeftEvent = (eventData) => new CustomEvent('user-left',
    {detail: {userId: eventData.userId}});
const createAndPublishUserJoinEvent = (eventData) => publishRoomEvent(createUserJoinEvent(eventData));
const createAndPublishUserLeftEvent = (eventData) => publishRoomEvent(createUserLeftEvent(eventData));

const roomEventHandler = ({data}) => {
    let parsedData = JSON.parse(data);

    switch (parsedData?.type) {
        case "FirstUserConnectedEvent":
            createAndPublishUserJoinEvent(parsedData);
            break;
        case "UserLeftEvent":
            createAndPublishUserLeftEvent(parsedData);
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

