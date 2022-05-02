fetch("./web-components/current/html/current_section.html")
    .then(stream => stream.text())
    .then(text => define(text));

export const define = (html) => {
    class CurrentSection extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = html;
        }
    }
    customElements.define('current-section', CurrentSection);
}