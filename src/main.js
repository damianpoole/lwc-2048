import { createElement } from 'lwc';
import App from 'game/app';

const elm = createElement('game-app', { is: App });
document.body.appendChild(elm);
