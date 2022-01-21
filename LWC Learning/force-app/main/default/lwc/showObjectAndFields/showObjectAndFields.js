import {
    LightningElement,
    track,
    wire
} from 'lwc';
import {
    getObjectInfo
} from 'lightning/uiObjectInfoApi';

import getObjectLabels from '@salesforce/apex/OrgData.getObjectLabels';

export default class ShowObjectAndFields extends LightningElement {
    @track objectLabels = [];
    @track fieldLabels = [];
    isObjSelected = true;
    isObjectsReceived = false;
    selectedObject = '';
    isFieldSelected = true;
    fieldSelected = [];

    // getting object meta data from org
    connectedCallback() {
        getObjectLabels()
            .then(
                (data) => {
                    let temp = [];
                    for (const property in data) {
                        temp.push({
                            label: data[property][1],
                            value: data[property][0],
                            //adding label and value to show in picklist
                        });
                    }
                    this.objectLabels = temp;
                    this.isObjSelected = false;
                    this.isObjectsReceived = true;
                }
            )
            .catch(
                (error) => {
                    console.log(error);
                }
            );
    }

    // for querying field values and 
    @wire(getObjectInfo, {
        objectApiName: '$selectedObject'
    }) wireHandler(data, error) {
        if (this.selectedObject != '') {
            if (data) {
                this.assignFieldValues(data);

            } else {
                console.log(error);
            }
        }
    }

    //assigning field values from wire adapter output
    assignFieldValues(data) {
        let temp = [];
        for (const property in data.data.fields) {
            temp.push({
                label: data.data.fields[property].label,
                value: data.data.fields[property].apiName,
                // adding label and value to show in checkbox
            });
        }
        this.fieldLabels = temp;
        this.isFieldSelected = false;
    }

    // updating field values
    handleFieldChange(e) {
        this.fieldSelected = e.detail.value;
    }

    // set selected object
    handleChange(event) {
        if (event.detail.value != '') {
            this.selectedObject = event.detail.value;
            this.isObjSelected = true;

        }
    }

    handleConfirm() {
        console.log(this.fieldSelected.join(','));
        this.dispatchEvent(new CustomEvent('content', {
            detail: {
                objectApiName: this.selectedObject,
                fieldsSelected: this.fieldSelected
            }
        }));
    }
}