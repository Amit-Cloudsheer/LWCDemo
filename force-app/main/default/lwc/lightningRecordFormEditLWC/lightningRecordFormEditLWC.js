import { LightningElement, api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import ACCOUNT_SOURCE_FIELD from '@salesforce/schema/Account.AccountSource';
import ACTIVE_FIELD from '@salesforce/schema/Account.Active__c';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import SHIPPING_ADDRESS_FIELD from '@salesforce/schema/Account.ShippingAddress';
export default class LightningRecordFormEditLWC extends LightningElement {
    @api recordId;
    @api objectApiName;
    fields = [NAME_FIELD, REVENUE_FIELD, INDUSTRY_FIELD, ACCOUNT_SOURCE_FIELD, ACTIVE_FIELD, RATING_FIELD, SHIPPING_ADDRESS_FIELD];
    handleSubmit(event) {
        //you can change values from here
        //const fields = event.detail.fields;
        //fields.Name = 'My Custom  Name'; // modify a field
        console.log('Account detail : ', event.detail.fields);
        console.log('Account name : ', event.detail.fields.Name);
        console.log('Account name : ', event.detail.fields.Active__c);
    }
}