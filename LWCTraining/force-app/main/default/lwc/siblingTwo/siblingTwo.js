import {
    LightningElement,
    wire,
    track
} from 'lwc';
import {
    registerListener
} from 'c/pubSub';
import {
    CurrentPageReference
} from 'lightning/navigation';

export default class SiblingTwo extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    @track description = 'This is the original value:';
    @track descriptionValue = 1;

    connectedCallback() {
        /* param1: name of event we fired
           param2: The Method that will be called when the event is received
           param3: A reference to this component
        */
        registerListener('siblingEvent', this.handleSiblingEvent, this);
    }

    handleSiblingEvent(siblingData) {
        console.log('Received Sibling event: ');

        //Check if data was passed from the Sibling component, if it has been then parse the values
        if (siblingData) {
            if (siblingData.description) {
                this.description = siblingData.description;
            }
            if (siblingData.value) {
                this.descriptionValue = siblingData.value;
            }
        }
    }
}