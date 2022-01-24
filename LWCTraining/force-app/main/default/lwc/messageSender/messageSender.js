import {
    LightningElement,
    wire
} from 'lwc';
import {
    MessageContext,
    publish
} from 'lightning/messageService';
import msgChannel from "@salesforce/messageChannel/MessageChannelPractice__c";
export default class MessageSender extends LightningElement {
    @wire(MessageContext)
    messageContext;
    num = 1;
    handleSendMessage() {
        publish(this.messageContext,
            msgChannel, {
                msg: this.num++
            },
        )
    }
}