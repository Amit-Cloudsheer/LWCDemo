import { LightningElement, api } from 'lwc';
import lookup from '@salesforce/apex/LookupController.lookup';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Lookup extends LightningElement {
    // information passed down from parent...
    @api objecttype;
    @api searchagainst;   //Name of the field against which we need to find the results. (In most cases or by default this would be Name) (Primary Field)
    @api secondaryfield;   // Name of the field which will be used as the meta text from the search results.
    @api maxResults = 10;
    @api label;
    @api variant;
    @api lookupicon = 'standard:record';
    @api isrequired = false;
    @api isdisabled = false;


    // Local information
    _isLoading = false;
    _searchResults = [];

    @api selectedId;
    @api selectedName;
    selectedSecondaryField;

    connectedCallback() {

    }

    get isLabelVisible() {
        return this.variant != 'label-hidden';
    }

    isDropDownVisible = false;
    startLookingUp(event) {
        let searchInput = event.target;
        this.selectedName = searchInput.value;

        if (searchInput.value.length > 1) {
            if (event.type == 'focus' && this.isDropDownVisible) {
                // in case of the focus event we just check if the dropdown has a value and if search results are there
                this.showLookupDropdown(searchInput);
                return;
            } else if (event.type == 'focus') {
                return;
            }

            this.isDropDownVisible = true;
            this._isLoading = true;
            lookup({
                objectType: this.objecttype,
                searchText: searchInput.value,
                searchAgainst: this.searchagainst,
                secondaryField: this.secondaryfield,
                maxResults: this.maxResults
            }).then(result => {
                this._searchResults = result.map(item => {
                    return {
                        Id: item.Id,
                        Name: item.Name,
                        primaryField: this.searchagainst != 'Name' ? item[this.searchagainst] : null, // If primary field is not name then it is the field we are filtering against.
                        secondaryField: item[this.secondaryfield] ? item[this.secondaryfield] : null
                    };
                });

                console.log(JSON.parse(JSON.stringify(this._searchResults)));
                this.showLookupDropdown(searchInput);
                this._isLoading = false;
            })
                .catch(error => {
                    console.log(JSON.parse(JSON.stringify(error)));
                    this.showNotification(error.body.message, 'error');
                    this._isLoading = false;
                });
        } else {
            this._searchResults = [];
        }
    }

    get hasSearchResults() {
        return this._searchResults.length > 0;
    }

    get hasSelection() {
        return this.selectedId && this.selectedName;
    }

    set hasSelection(value) {
        this.uppercaseItemName = value.toUpperCase();
    }

    handleSelection(event) {
        let selectedLine = event.currentTarget;

        this.selectedId = selectedLine.dataset.id;
        this.selectedName = selectedLine.dataset.name;
        this.selectedSecondaryField = selectedLine.dataset.secondaryfield;

        this.disptachSelectionEvent();
        this.clearDropdown();
    }

    clearSelection() {
        this.selectedId = null;
        this.selectedName = null;
        this.selectedSecondaryField = null;

        // Move focus to the nearest input box, using a timeout because the input that we need to focus on doesnt exist yet.
        setTimeout(function () {
            let inputEle = this.template.querySelector("lightning-input");
            if (inputEle) {
                inputEle.focus();
            }
        }.bind(this), 0);

        let formElement = this.template.querySelector('.slds-form-element');
        if (formElement && formElement.classList.contains('slds-has-error')) {
            formElement.classList.remove('slds-has-error');
        }

        this.disptachSelectionEvent();
    }

    disptachSelectionEvent() {
        const selectedEvent = new CustomEvent('selection', {
            detail: {
                recordId: this.selectedId,
                recordName: this.selectedName,
                searchedagainst: this.searchagainst,
                secondaryFieldValue: this.selectedSecondaryField
            }
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    clearDropdown() {
        this.template.querySelectorAll('div.slds-dropdown-trigger').forEach((container) => {
            if (!container.classList.contains('slds-is-open')) {
                return;
            }

            container.classList.remove("slds-is-open");
            container.setAttribute("aria-expanded", false);
        })
    }

    showLookupDropdown(currentNode) {
        let parent = currentNode.closest("div.slds-dropdown-trigger");
        if (!parent.classList.contains('slds-is-open')) {
            parent.classList.add("slds-is-open");
            parent.setAttribute("aria-expanded", true);
        }
    };

    showNotification(message, variant) {
        const evt = new ShowToastEvent({
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    @api removeSelection() {
        this.selectedId = '';
        this.selectedName = '';
        this._searchResults = [];

        //clear the input too...
        let inputBlock = this.template.querySelector('input');
        if (inputBlock) {
            inputBlock.value = '';
        }
    }

    @api isValid() {
        if (this.isrequired && !this.selectedId) {
            return false;
        } else {
            return true;
        }
    }

    @api setCustomValidity(message) {
        let searchBox = this.template.querySelector('lightning-input[data-name="lookupInput"]');
        console.log(message);
        if (searchBox) {
            console.log(message);
            searchBox.setCustomValidity(message);
            searchBox.reportValidity();
        } else {
            // If we come here that means, there is a selection already in the lookup where we want to throw an error.
            let selectedInput = this.template.querySelector('input[data-name="inputselection"]');
            if (selectedInput && message) {
                let formElement = this.template.querySelector('.slds-form-element');
                if (formElement) {
                    formElement.classList.add('slds-has-error');
                }

                let helpText = this.template.querySelector('.slds-form-element__help');
                if (helpText) {
                    helpText.innerHTML = message;
                }
            } else {
                let formElement = this.template.querySelector('.slds-form-element');
                if (formElement && formElement.classList.contains('slds-has-error')) {
                    formElement.classList.remove('slds-has-error');
                }

                let helpText = this.template.querySelector('.slds-form-element__help');
                if (helpText) {
                    helpText.innerHTML = '';
                }
            }
        }
    }

    @api reportValidity() {
        let searchBox = this.template.querySelector('lightning-input[data-name="lookupInput"]');
        if (this.isrequired && (!this.selectedId || !this.selectedName)) {
            if (searchBox) {
                if (!this.selectedId && this.selectedName) {
                    searchBox.setCustomValidity('Please select an option from the dropdown.');
                } else {
                    searchBox.setCustomValidity('Complete this field.');
                }
                searchBox.reportValidity();
            }
        } else if (searchBox) {
            searchBox.setCustomValidity('');
            searchBox.reportValidity();
        }
    }


    // New logic for the dropdown visibility
    _isBlurAllowed = true;
    handleDropdownMouseOver() {
        this._isBlurAllowed = false;
    }

    handleDropdownMouseOut() {
        this._isBlurAllowed = true;
    }

    closeDropdown() {
        console.log('this._isBlurAllowed == ' + this._isBlurAllowed);
        if (this._isBlurAllowed) {
            this.clearDropdown();
        }
    }
}