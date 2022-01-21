import {
    LightningElement
} from 'lwc';

export default class TableParentContainer extends LightningElement {
    isObjFieldsReceived = false;
    content = [];
    // content = [{
    //     fields: ['FirstName', 'LastName', 'Email'],
    //     objApiName: "Contact"
    // }];

    //obtain field values and send data to table render.
    handleOnContent(event) {
        this.content.push({
            objApiName: event.detail.objectApiName,
            fields: event.detail.fieldsSelected,
        })
        this.isObjFieldsReceived = true;
        console.log(JSON.parse(JSON.stringify(this.content)));
    }

}