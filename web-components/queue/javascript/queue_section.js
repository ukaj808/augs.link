fetch("./web-components/queue/html/queue_section.html")
    .then(stream => stream.text())
    .then(text => define(text));

export const define = (html) => {
    class QueueSection extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = html;
        }
    }
    customElements.define('queue-section', QueueSection);
}