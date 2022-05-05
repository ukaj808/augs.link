fetch("./web-components/order/html/order_section.html")
    .then(stream => stream.text())
    .then(text => define(text));

export const define = (html) => {
    const roomElement = document.getElementById("room");
    let shadow;

    const createNewUserListElement = (userDetails) => {
        let newUserElement = document.createElement("li");
        let orderLabel = document.createElement("label");
        let usernameLabel = document.createElement("label");
        let icon = document.createElement("img");

        newUserElement.classList.add("user-order-list__user");
        orderLabel.classList.add("user-order-list__order-lbl");
        orderLabel.innerText = "1";
        usernameLabel.classList.add("user-order-list__username-lbl");
        usernameLabel.innerText = userDetails.username;

        icon.classList.add("user-order-list__icon");
        icon.alt = `${userDetails.username} icon`;
        icon.src = "./images/sample_icon.jpg";

        newUserElement.append(orderLabel, usernameLabel, icon);
        return newUserElement;
    }

    const onUserJoin = ({detail}) => {
        shadow.querySelector("#user-order-list").appendChild(createNewUserListElement(detail));
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
        }

        disconnectedCallback() {
            roomElement.removeEventListener("user-join", onUserJoin);
            super.disconnectedCallback && super.disconnectedCallback();
        }

    }
    customElements.define('order-section', OrderSection);
}