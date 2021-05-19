"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeDialog = void 0;
const botbuilder_1 = require("botbuilder");
const constants_1 = require("./common/constants");
class WelcomeDialog extends botbuilder_1.ActivityHandler {
    constructor(conversationState, userState, dialog) {
        super();
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');
        this.onMessage((context, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('Running dialog with Message Activity.');
            // Run the Dialog with the new message Activity.
            yield this.dialog.run(context, this.dialogState);
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
        this.onMembersAdded((context, next) => __awaiter(this, void 0, void 0, function* () {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    yield context.sendActivity(botbuilder_1.MessageFactory.text(constants_1.Constants.welcomeText, constants_1.Constants.welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
        this.onDialog((context, next) => __awaiter(this, void 0, void 0, function* () {
            // Save any state changes. The load happened during the execution of the Dialog.
            yield this.conversationState.saveChanges(context, false);
            yield this.userState.saveChanges(context, false);
            yield next();
        }));
    }
}
exports.WelcomeDialog = WelcomeDialog;
//# sourceMappingURL=bot.js.map