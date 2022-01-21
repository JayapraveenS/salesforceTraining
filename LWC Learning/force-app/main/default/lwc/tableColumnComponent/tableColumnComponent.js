import {
    LightningElement,
    api,
    track
} from 'lwc';
export default class TableColumnComponent extends LightningElement {
    @api singleRecord; //{Name:__,...}
    @api objectName;
    @api fieldApiName; //field__c or Name...
    @track output;
    editting = false;
    connectedCallback() {
        this.output = this.singleRecord[this.fieldApiName];
    }
    dblClicked() {
        this.editting = true;
    }
    changedData(event) {
        this.dispatchEvent(
            new CustomEvent('valchanged', {
                detail: {
                    field: event.detail.field,
                    newVal: event.detail.newVal
                }
            })
        );
    }
}