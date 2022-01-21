import {
    LightningElement,
    track
} from 'lwc';
import getFieldSet from '@salesforce/apex/OrgData.getFieldSet';

export default class FieldsetTable extends LightningElement {
    objectApiName = 'Account';
    fieldsToFetchFieldSet = 'fieldSet';
    isDataLoaded = false;
    @track content = [];

    connectedCallback() {
        getFieldSet({
                objectApiName: this.objectApiName,
                fieldSetName: this.fieldsToFetchFieldSet
            })
            .then(
                (data) => {
                    let fields = [];
                    data.forEach(element => {
                        fields.push(element.apiName);
                    });
                    this.content.push({
                        objApiName: this.objectApiName,
                        fields: fields,
                    });
                    this.isDataLoaded = true;

                }
            )
            .catch(
                (error) => {
                    console.log(JSON.parse(JSON.stringify('The error is:', error)));
                }
            )

    }
}