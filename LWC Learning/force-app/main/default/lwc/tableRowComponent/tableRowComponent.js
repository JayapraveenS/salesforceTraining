import {
    LightningElement,
    api,
    track
} from 'lwc';
import getFieldType from '@salesforce/apex/OrgData.getFieldType'
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import updateRecord from '@salesforce/apex/OrgData.updateRecord';

export default class TableRowComponent extends LightningElement {
    @api singleRecord; //{Name:__,...}        
    @api metaData; //[objApiName, [fields selected array]]      
    @track fieldApis;
    @track objectName;
    @track fieldtypeObj;
    @track newRecord; //contains new updated value if editted else undefined
    editting = false;
    connectedCallback() {
        this.fieldApis = this.metaData[1];
        this.objectName = this.metaData[0];
    }
    handleValChanged(event) {
        if (!this.newRecord) {
            this.newRecord = {
                'Id': this.singleRecord.Id,
            };
        }
        this.newRecord[event.detail.field] = event.detail.newVal;
        this.dispatchEvent(
            new CustomEvent('recordvalchanged', {
                detail: {
                    updatedRecord: this.newRecord
                }
            })
        );
    }
    handleEdit() {

        getFieldType({
                objectApiName: this.objectName,
                fieldList: this.fieldApis
            })
            .then(
                (data) => {
                    console.log(JSON.parse(JSON.stringify(data)));
                    this.fieldtypeObj = data;
                    this.editting = true;
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
    changedData(event) {

        console.log(JSON.parse(JSON.stringify(this.newRecord)));
    }

    updateRec() {
        if (this.newRecord != undefined) {
            updateRecord({
                    obj: this.newRecord
                })
                .then(
                    (data) => {
                        this.reloadRequired();
                    }
                )
                .catch(
                    (error) => {
                        console.log(error);
                    }
                );
        }
    }
    reloadRequired() {
        this.dispatchEvent(new CustomEvent('reloadrequired'));
    }
    handleSubmit() {
        this.editting = false;
    }
}