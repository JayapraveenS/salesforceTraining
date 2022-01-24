import {
    LightningElement,
    wire
} from 'lwc';
import {
    MessageContext,
    publish
} from 'lightning/messageService';
import recordSelected from "@salesforce/messageChannel/MessageChannelPractice__c";
// import SAVE_PROGRAM_DETAIL_MESSAGE_CHANNEL from "@salesforce/messageChannel/SaveProgramDetail__c";
export default class MessageSender extends LightningElement {
    connectedCallback() {
        // publish(MessageContext,
        //     recordSelected, {
        //         msg: 'published'
        //     },
        // )
    }
}