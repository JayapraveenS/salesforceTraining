import {
    LightningElement,
    track
} from 'lwc';
import getDynamicVals from '@salesforce/apex/OrgData.getDynamicVals';

export default class DynamicDataTable extends LightningElement {
    isObjSelected = false;
    isFieldSelected = true; // manupulated for template rendering
    isDataLoaded = false;
    value = '';
    fieldValue = [''];
    fieldOptions;
    Query;
    Offset = 0;
    objOptions = [{
            label: 'Choose any one',
            value: ''
        },
        {
            label: 'Account',
            value: 'Account'
        },
        {
            label: 'Contact',
            value: 'Contact'
        }
    ];
    @track data = [];
    // Select object type function
    handleChange(event) {
        if (event.detail.value != '') {
            this.value = event.detail.value;
            this.isObjSelected = true;
            this.isFieldSelected = false;
            if (event.detail.value == 'Account') {
                this.fieldOptions = [{
                        label: 'Name',
                        value: 'Name'
                    },
                    {
                        label: 'Phone',
                        value: 'Phone'
                    },
                    {
                        label: 'Number of child Opportunities',
                        value: 'Number_of_child_Opportunities__c'
                    }
                ];
            } else if (event.detail.value == 'Contact') {
                this.fieldOptions = [{
                        label: 'lastName',
                        value: 'LastName'
                    },
                    {
                        label: 'Email',
                        value: 'Email'
                    },
                    {
                        label: 'Phone',
                        value: 'Phone'
                    },
                ];
            }
        }
    }

    // update selected field values 
    handleFieldChange(e) {
        this.fieldValue = e.detail.value;
    }

    // After confirming query data from org and store in data obj
    handleConfirm() {
        this.Query = 'SELECT ID,' + this.fieldValue.join(',') + ' FROM ' + this.value + ' LIMIT 10 ' + 'OFFSET ' + this.Offset + '';
        let query = this.Query;

        getDynamicVals({
            query: query
        }).then(
            (data) => {
                this.isFieldSelected = true;
                this.data = data;
                this.isDataLoaded = true;
            }
        ).catch(
            (error) => {
                console.log('Error is: ' + JSON.stringify(error));
            }
        );
    }

    LoadMore() {
        this.Limit += 10;
        this.handleConfirm();
    }
}