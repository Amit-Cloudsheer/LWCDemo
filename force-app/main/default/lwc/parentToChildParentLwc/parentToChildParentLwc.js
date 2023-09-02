import { LightningElement } from 'lwc';

export default class ParentToChildParentLwc extends LightningElement {
    parentHandler(event) {
        this.template.querySelector('c-parent-to-child-child-lwc').greet('Hey, This Message Is Sent From Parent!');
    }
}