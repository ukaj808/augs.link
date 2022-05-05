fetch("./web-components/order/html/order_section.html")
    .then(stream => stream.text())
    .then(text => define(text));

export const define = (html) => {
    class OrderSection extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = html;
        }

        onUserJoin() {

        }

        onUserLeave() {

        }
    }
    customElements.define('order-section', OrderSection);
}