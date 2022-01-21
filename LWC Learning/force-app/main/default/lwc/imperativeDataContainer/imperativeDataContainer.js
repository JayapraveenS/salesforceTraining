import {
    LightningElement,
    track
} from 'lwc';
import getData from '@salesforce/apex/OrgData.getData';
import updateRecord from '@salesforce/apex/OrgData.updateRecord';
import DeleteRecord from '@salesforce/apex/OrgData.DeleteRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createRecord from '@salesforce/apex/OrgData.createRecord';
export default class ImperativeDataContainer extends LightningElement {
    @track contacts;
    EditName;
    EditEmail;
    EditPhone;
    EdittingRecordId;
    index;
    DeletePressed=false;
    recordId;
    createPressed=false;
    
    connectedCallback()
    {
        this.fetchRecords();
    }

    fetchRecords() {
        getData().then(
                data => {
                    this.contacts = JSON.parse(JSON.stringify(data));
                }
            )
            .catch(
                fault => {
                    console.log(fault);
                }
            )
    }
    createRecord()
    {   
        let con ={};
        con['LastName']=this.EditName;
        con['Phone']=this.EditPhone;
        con['Email']=this.EditEmail;
        createRecord({con})
        .then(
            ()=>
            {
            this.dispatchEvent(new ShowToastEvent(
                {
                title: 'New record',
                message:
                'Insert success',
                variant:'success'
                }
            ));
            }
        ).catch(
            fault => 
            {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Create record',
                    message:
                    JSON.parse(JSON.stringify(fault)).body.message,
                    variant:'error' 
                }));
                
                console.log(JSON.parse(JSON.stringify(fault)).body.message);
            }
        );
    }
    DeleteConfirmination()
    {
        let recordId =this.recordId;
        DeleteRecord({recordId}).then(
            success => 
            {
            this.dispatchEvent(new ShowToastEvent({
                 title: 'Delete',
                 message:
                 'Success',
                 variant:'success'
             }));
             this.DeletePressed=false;
             this.fetchRecords();
             if(success != null || success != undefined)
             {
                 console.log(JSON.stringify(success));
             }
            }
        ).catch(
         fault => 
         {
             this.dispatchEvent(new ShowToastEvent({
                 title: 'Delete',
                 message:
                 JSON.parse(JSON.stringify(fault)).body.message,
                 variant:'error' 
             }));
             
             console.log(JSON.parse(JSON.stringify(fault)).body.message);
         }
        );
    }
    ctrlEdit(event) {
        //Below code doesn't required because the js array property managed automatically by js itself by adding additional property;
        // this.contacts.forEach(
        //     (element, index) => {
        //     if(!(element.hasOwnProperty('edit')))// If does not have edit property this adds it.
        //         {
        //             this.contacts[index]['edit']=false;
        //         }
        //     }
        // );
        if(this.index != undefined)
        {
            this.contacts[this.index].edit=false;
        }
        
        this.index = event.target.dataset.index; // Initialize the index with current element index
        this.contacts[this.index].edit=true;  
        console.log('The contact is:'+JSON.stringify(this.contacts));
        this.EditName=this.contacts[this.index].LastName;
        this.EditPhone=this.contacts[this.index].Phone;
        this.EditEmail=this.contacts[this.index].Email;
        this.EdittingRecordId=this.contacts[this.index].Id;
    }
    changed(event) {
        if (event.target.name == 'LastName'){
            this.EditName = event.target.value;
        } else if (event.target.name == 'Email') {
            this.EditEmail=event.target.value;
        } else if (event.target.name == 'Phone') {
            this.EditPhone=event.target.value;
        }
    }
    createContact()
    {
        this.createPressed=true;
    }
    ctrlCancel()
    {
        this.createPressed=false;
        this.DeletePressed=false;
        this.fetchRecords();
    }
    ctrlSave() {        
        let con={
        'Id': this.EdittingRecordId,
        'LastName': this.EditName,
        'Phone':this.EditPhone,
        'Email':this.EditEmail
        };
        console.log('The contact set is:'+ JSON.stringify(con));
        updateRecord({con}).then(
            success=> 
            {
                this.dispatchEvent(new ShowToastEvent(
                    {
                        title:'Update',
                        message:'Success',
                        variant:'success'
                    }
                ));
               this.fetchRecords();
            }
        ).catch(
            fault=> 
            {
                this.dispatchEvent(new ShowToastEvent(
                    {
                        title:'Update',
                        message:'Failed',
                        variant:'error'
                    }
                ));
                console.log('Some error'+JSON.stringify(fault));
            }
        );
    }
    ctrlDelete(event){
        this.recordId=this.contacts[event.target.dataset.index].Id;
        this.DeletePressed=true;
    }
}