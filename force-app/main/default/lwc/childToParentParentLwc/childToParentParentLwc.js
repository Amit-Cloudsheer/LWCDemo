import { LightningElement } from 'lwc';

export default class ChildToParentParentLwc extends LightningElement {
    message;

    parentHandler(event) {
        this.message = event.detail;
    }
}