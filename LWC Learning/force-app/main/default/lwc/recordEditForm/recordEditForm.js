import {
    LightningElement,
    api
} from 'lwc';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
export default class RecordEditForm extends LightningElement {
    @api fields;
    @api objName;
    @api singleRecord;
    display = true;
    ctrlCancel() {
        this.display = false;
    }
    handleSubmit() {
        this.display = false;

    }
    handleError() {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Record',
            message: 'updated failed',
            variant: 'error',
        }));

    }
    handleSuccess() {
        this.dispatchEvent(new CustomEvent('editted'));
        this.dispatchEvent(new ShowToastEvent({
            title: 'Record',
            message: 'updated successfully',
            variant: 'success',
        }));
    }
}