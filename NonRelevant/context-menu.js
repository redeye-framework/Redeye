class ContextMenu {
    constructor(data) {
        this.theme = data.theme
        this.build(data.items);
    }

    build(options) {
        this.menu = document.createElement('menu');
        this.menu.classList.add(`context-menu-${this.theme}`);
        options.forEach(option => this.buildOption(option));
        document.body.appendChild(this.menu);
    }

    buildOption(option) {
        const li = document.createElement('LI');
        li.classList.add(`context-menu-${this.theme}-item`);
        li.addEventListener('click', option.action);

        const button = document.createElement('button');
        button.classList.add(`context-menu-${this.theme}-btn`);

        const i = document.createElement('i');
        i.classList.add(`context-menu-${this.theme}-icon`);
        i.classList.add('fa');
        i.classList.add(`fa-${option.icon}`);

        const span = document.createElement('span');
        span.classList.add(`context-menu-${this.theme}-text`);
        span.textContent = option.name;

        button.appendChild(i);
        button.appendChild(span);
        li.appendChild(button);
        this.menu.appendChild(li);
    }

    show(x, y) {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const mw = this.menu.offsetWidth;
        const mh = this.menu.offsetHeight;

        if (x + mw > w) { x = x - mw; }
        if (y + mh > h) { y = y - mh; }

        this.menu.style.left = x + 'px';
        this.menu.style.top = y + 'px';
        this.menu.classList.add(`show-context-menu-${this.theme}`);
    }

    hide() {
        this.menu.classList.remove(`show-context-menu-${this.theme}`);
    }

    isOpen() {
        return this.menu.classList.contains(`show-context-menu-${this.theme}`);
    }
}