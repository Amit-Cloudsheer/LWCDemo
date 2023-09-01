import { LightningElement, track } from 'lwc';
export default class ModalPopupLWC extends LightningElement {
    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    @track isModalOpen = false;
    openModal() {
        // to open modal set isModalOpen track value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen track value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen track value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }
}