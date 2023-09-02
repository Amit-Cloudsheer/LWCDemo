import { LightningElement } from 'lwc';
export default class ChildToParentChildLwc extends LightningElement {
    childHandler() {
        const evt = new CustomEvent('sendmessage', { detail: "Hey, This message is sent from child Component" });
        this.dispatchEvent(evt);
    }
}