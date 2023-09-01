import { LightningElement, track } from 'lwc';
import serachAccs from '@salesforce/apex/AccountSearchController.retriveAccounts';

// datatable columns
const columns = [
    {
        label: 'Name',
        fieldName: 'Name',
        type: 'url',
        typeAttributes: { label: { fieldName: 'Name' }, target: '_blank' }
    },
    {
        label: 'Annual Revenue',
        fieldName: 'AnnualRevenue',
        type: 'text',
    },
];
export default class AccountSearchLWC extends LightningElement {
    @track searchData;
    @track columns = columns;
    @track strSearchAccName;

    handleAccountName(event) {
        this.strSearchAccName = event.detail.value;
        serachAccs({ strAccountName: this.strSearchAccName })
            .then(result => {
                this.searchData = result;
            })
    }
}