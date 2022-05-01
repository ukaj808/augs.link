import {OrderSection} from "./web-components/sections/order_section.js";
customElements.define('order-section', OrderSection);

import {CurrentSection} from "./web-components/sections/current_section.js";
customElements.define('current-section', CurrentSection);

import {DemocracySection} from "./web-components/sections/democracy_section.js";
customElements.define('democracy-section', DemocracySection);

import {DropSection} from "./web-components/sections/drop_section.js";
customElements.define('drop-section', DropSection);

import {QueueSection} from "./web-components/sections/queue_section.js";
customElements.define('queue-section', QueueSection);

const roomId = location.pathname.substr(1);
console.log(roomId);

const connect = () => {
    let ws;
    if (ws) ws.close();
    ws = new WebSocket(`ws://${location.host}/${roomId}/ws`);
    ws.addEventListener("open", () => {
        console.log("open", ws);
    });
    ws.addEventListener("close", () => {
        console.log("close", ws);
    });
};

connect();

