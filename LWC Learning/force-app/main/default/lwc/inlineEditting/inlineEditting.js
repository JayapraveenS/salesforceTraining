import {
    LightningElement,
    api,
    track
} from 'lwc';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

import getFieldType from '@salesforce/apex/OrgData.getFieldType'

export default class InlineEditting extends LightningElement {
    @api fieldApiName; //field__c or Name...
    @api singleRecord;
    @api objectName;
    @track fieldType; //initialized in connected call back

    //for handlinling changes 
    currentValue;
    isValueChanged = false;
    changedValue;


    //for finding field type
    isDate = false;
    isText = false;
    isPhone = false;
    isEmail = false;
    isNumber = false;
    isBoolean = false;
    isDatetime = false;
    isOthers = false;

    connectedCallback() {
        this.currentValue = this.singleRecord[this.fieldApiName];
        let fieldApis = [];
        fieldApis.push(this.fieldApiName);
        getFieldType({
                objectApiName: this.objectName,
                fieldList: fieldApis
            })
            .then(
                (data) => {
                    this.edittingMode(data[this.fieldApiName]);
                }
            )
            .catch(
                (error) => {
                    console.log(error);
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Failed to edit',
                        message: JSON.stringify(error),
                        variant: 'error'
                    }));

                }
            )

    }
    edittingMode(fieldType) {
        this.fieldType = fieldType;
        switch (fieldType) {
            case 'EMAIL':
                this.isEmail = true;
                break;
            case 'PHONE':
                this.isPhone = true;
                break;
            case 'STRING':
                this.isText = true;
                break;
            case 'CURRENCY':
            case 'DOUBLE':
                this.isNumber = true;
                break;
            case 'DATATIME':
                this.isDatetime = true;
                break;
            case 'DATE':
                this.isDate = true;
                break;
            case 'BOOLEAN':
                this.isBoolean = true;
                break;
            default:
                this.isOthers = true;

        }
    }
    valChanged() {
        this.isValueChanged = true;
    }

    fieldBlured(event) {
        if (this.isValueChanged == true && this.currentValue != event.target.value) {
            this.changedValue = event.target.value;
            this.dispatchEvent(
                new CustomEvent('fieldvalchanged', {
                    detail: {
                        field: this.fieldApiName,
                        newVal: this.changedValue
                    }
                })
            );
        }
    }


}