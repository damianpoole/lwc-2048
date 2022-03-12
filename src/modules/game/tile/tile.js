import { LightningElement, api } from 'lwc';

export default class Tile extends LightningElement {
    @api
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;

        const power = Math.log2(value);
        const backgroundLightness = 100 - power * 10;
        this.template.host.style.setProperty(
            '--background-lightness',
            `${backgroundLightness}%`
        );
        this.template.host.style.setProperty(
            '--text-lightness',
            `${backgroundLightness <= 55 ? 90 : 15}%`
        );
    }

    @api
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
        this.template.host.style.setProperty('--x', value);
    }

    @api
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
        this.template.host.style.setProperty('--y', value);
    }

    _x;
    _y;
    _value;

    connectedCallback() {
        this.template.host.classList.add('show');
    }

    handleTransitionEnd() {
        this.template.host.classList.remove('show');
        this.dispatchEvent(new CustomEvent('transitionend'));
    }
}
