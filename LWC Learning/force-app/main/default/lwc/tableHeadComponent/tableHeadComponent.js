import {
    LightningElement,
    api
} from 'lwc';

export default class TableHeadComponent extends LightningElement {
    @api fieldApiName; //field__c or Name...
}