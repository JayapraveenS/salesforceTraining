import {
    LightningElement,
    wire
} from 'lwc';
import {
    MessageContext,
    subscribe
} from 'lightning/messageService';
import MessageChannel from '@salesforce/msgChannel/msgChannel__c';

export default class MessageReceiver extends LightningElement {
    @wire(MessageContext)
    MessageContext;
    subscription = null;
    receivedMessage;
    connectedCallback() {
        if (this.subscription == null) {
            this.subscription = subscribe(this.MessageContext, MessageChannel, (message) => {
                this.receivedMessage = message.msg;
            })
        }
    }
}