fetch("./web-components/drop/html/drop_section.html")
    .then(stream => stream.text())
    .then(text => define(text));

export const define = (html) => {
    class DropSection extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = html;
        }
    }
    customElements.define('drop-section', DropSection);
}