// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, BotState, ConversationState, StatePropertyAccessor, UserState, MessageFactory } from 'botbuilder';
import { Dialog, DialogState } from 'botbuilder-dialogs';
import { Constants } from './common/constants';
import { UserProfileDialog } from './dialogs/userProfileDialog';
export class WelcomeDialog extends ActivityHandler {
    private conversationState: BotState;
    private userState: BotState;
    private dialog: Dialog;
    private dialogState: StatePropertyAccessor<DialogState>;
    constructor(conversationState: BotState, userState: BotState, dialog: Dialog) {
        super();

        this.conversationState = conversationState as ConversationState;
        this.userState = userState as UserState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');
        
        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');
            
            // Run the Dialog with the new message Activity.
            await (this.dialog as UserProfileDialog).run(context, this.dialogState);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(Constants.welcomeText, Constants.welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
            await next();
        });
    }
}
