fetch("./web-components/order/html/order_section.html")
    .then(stream => stream.text())
    .then(text => define(text));

const define = (html) => {
    const roomElement = document.getElementById("room");
    let shadow;

    const createNewUserListElement = (userDetails) => {
        const userTemplate = shadow.querySelector('#user-template');
        const clone = userTemplate.content.cloneNode(true);
        const listItemElement = clone.querySelector("li");

        listItemElement.id = userDetails.userId;

        const orderLabel = listItemElement.children[0];
        const usernameLabel = listItemElement.children[1];


        
        orderLabel.textContent = "1";
        usernameLabel.textContent = userDetails.username;

        return clone;
    }

    const onUserJoin = ({detail}) => {
        console.log({detail})
        shadow.querySelector("#user-order-list").appendChild(createNewUserListElement(detail));
    }

    const onUserLeft = ({detail}) => {
        shadow.getElementById(detail.userId).remove();
    }

    class OrderSection extends HTMLElement {
        constructor() {
            super();
            shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = html;
        }

        connectedCallback() {
            super.connectedCallback && super.connectedCallback();
            roomElement.addEventListener("user-join", onUserJoin);
            roomElement.addEventListener("user-left", onUserLeft)
        }

        disconnectedCallback() {
            roomElement.removeEventListener("user-join", onUserJoin);
            roomElement.addEventListener("user-left", onUserLeft)
            super.disconnectedCallback && super.disconnectedCallback();
        }

    }
    customElements.define('order-section', OrderSection);
}