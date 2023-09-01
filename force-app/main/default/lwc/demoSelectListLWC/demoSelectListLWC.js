import { LightningElement, wire } from 'lwc';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_RATING_FIELD from '@salesforce/schema/Account.Rating';
import accountObject from '@salesforce/schema/Account';

export default class DemoSelectListLWC extends LightningElement {
    selectedRating = '';
    ratingOptions = null;
    @wire(getObjectInfo, { objectApiName: accountObject })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: ACCOUNT_RATING_FIELD })
    wiredRatingValues({ error, data }) {
        console.log('<====data===>');
        console.log(data);
        console.log(data);
        if (data && data.values) {
            this.ratingOptions = [{ label: '--None--', value: '' }];
            console.log(data.values);
            data.values.forEach(val => {
                console.log(val);
                this.ratingOptions.push({
                    label: val.label,
                    value: val.value
                })
            });
        } else if (error) {
            this.error = error;
            this.record = undefined;
        }
    }

}