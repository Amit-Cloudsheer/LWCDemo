import { LightningElement, api } from 'lwc';
export default class ComboBox extends LightningElement {
    @api label;
    @api variant; //Possible Values = label-hidden
    @api selectedValue;
    @api placeholder;
    @api cssClass;
    @api _disabled = false;
    @api _required = false;

    _options;
    _helpMessage;

    @api get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    @api get required() {
        return this._required;
    }

    set required(value) {
        this._required = value;
    }


    @api get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = value;
    }


    @api get value() {
        return this.selectedValue;
    }

    set value(value) {
        this.selectedValue = value;
    }

    get isLabelVisible() {
        return this.variant != 'label-hidden';
    }


    @api get isValid() {
        let allValid = true;
        // Check all the validation here and add errors accordingly.
        if (this.required && !this.selectedValue) {
            allValid = false;
        }

        return allValid;
    }

    @api
    checkValidity() {
        return this.isValid();
    }

    @api
    reportValidity() {
        if (this._helpMessage && this._helpMessage != '') {
            this.classList.add('slds-has-error');
        } else if (this.classList.contains('slds-has-error')) {
            this.classList.remove('slds-has-error');
        }
    }

    @api
    setCustomValidity(message) {
        this._helpMessage = message;
    }

    handleSelect(event) {
        if (event.currentTarget.value === this.selectedValue) {
            return;
        }
        this.selectedValue = event.currentTarget.value;

        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    value: this.selectedValue
                }
            })
        );
    }

    connectedCallback() {
        this.classList.add('slds-form-element');
    }
}