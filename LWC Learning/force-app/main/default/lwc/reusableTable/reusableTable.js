import {
    LightningElement,
    api,
    track
} from 'lwc';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import getDynamicVals from '@salesforce/apex/OrgData.getDynamicVals';
import updateListRecord from '@salesforce/apex/OrgData.updateListRecord';
export default class ReusableTable extends LightningElement {
    @api content;
    @track result = [];
    @track fieldsSelected;
    @track orgAndFieldsMetadata = [];
    @track newRecords = {};
    Offset = 0;
    Limit = 10;
    isReloading = false;
    showSave = false;
    connectedCallback() {
        console.log(JSON.parse(JSON.stringify(this.content)));
        this.getData();
    }
    getData() {
        let query = 'SELECT ' + JSON.parse(JSON.stringify(this.content[0])).fields.join(',') + ' FROM ' + JSON.parse(JSON.stringify(this.content[0])).objApiName + ' LIMIT ';
        if (this.isReloading == true) {
            let Limit2 = this.Offset + 10;
            this.result = [];
            query += Limit2 + ' OFFSET 0';
        } else {
            query += this.Limit + ' OFFSET ' + this.Offset;
        }
        this.orgAndFieldsMetadata[0] = (JSON.parse(JSON.stringify(this.content[0]))).objApiName;
        this.orgAndFieldsMetadata[1] = (JSON.parse(JSON.stringify(this.content[0])).fields); //[objApiName,[fields]]
        console.log(query);
        getDynamicVals({
            query: query
        }).then(
            (data) => {
                data.forEach(element => {
                    this.result.push(element); // so the result looks like [ {},{},{}....]
                });
                this.isReloading = false; //rollbacking isReloading to false state;
            }
        ).catch(
            (error) => {
                console.log('Error is: ' + JSON.stringify(error));
                this.isReloading = false; //rollbacking isReloading to false state;
            }
        );
    }
    LoadMore() {
        this.Offset += 10;
        this.getData();
    }
    reload() {
        this.isReloading = true;
        this.getData();
        this.showSave = false;
    }
    handleRecordValChanged(event) {
        this.newRecords[event.detail.updatedRecord.Id] = [event.detail.updatedRecord];
        this.showSave = true;
    }
    handleCancel() {
        this.reload();
        this.showSave = false;
    }
    handleSave() {
        let updatabeRecords = [];
        Object.values(this.newRecords).forEach(element => {
            updatabeRecords.push(element[0]);
        });
        this.showSave = false;
        this.reload();
        updateListRecord({
                recordList: updatabeRecords
            })
            .then(
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Update successfull',
                    message: 'Updated successfully',
                    variant: 'success'
                }))
            )
            .catch(
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Failed to update',
                    message: JSON.stringify(error),
                    variant: 'error'
                }))

            );
    }
}