import { LightningElement, api } from 'lwc';

export default class ParentToChildChildLwc extends LightningElement {
    message;

    @api greet(message) {
        // Suppose a translating capability is here which translate the message param to local user's language
        this.message = message;
    }
}