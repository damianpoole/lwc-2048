import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    score = 0;

    handleScoreUpdate({ detail }) {
        this.score = this.score + detail;
    }
}
