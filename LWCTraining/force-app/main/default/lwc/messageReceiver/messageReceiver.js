import {
    LightningElement,
    wire
} from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import recordSelected from "@salesforce/messageChannel/MessageChannelPractice__c";

export default class MessageReceiver extends LightningElement {
    @wire(MessageContext)
    messageContext;
    subscription = null;
    receivedMessage;
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                recordSelected,
                (message) => this.handleMessage(message), {
                    scope: APPLICATION_SCOPE
                }
            );
        }
    }
}