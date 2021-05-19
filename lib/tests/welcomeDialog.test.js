"use strict";
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
const botbuilder_1 = require("botbuilder");
const bot_1 = require("../bot");
const userProfileDialog_1 = require("../dialogs/userProfileDialog");
const constants_1 = require("../common/constants");
const assert = require('assert');
describe('DialogAndWelcomeBot', () => {
    const testAdapter = new botbuilder_1.TestAdapter((context) => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
    function processActivity(activity, bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = new botbuilder_1.TurnContext(testAdapter, activity);
            yield bot.run(context);
        });
    }
    it('Starts main dialog', () => __awaiter(void 0, void 0, void 0, function* () {
        const memoryStorage = new botbuilder_1.MemoryStorage();
        // Create conversation state with in-memory storage provider.
        const conversationState = new botbuilder_1.ConversationState(memoryStorage);
        const userState = new botbuilder_1.UserState(memoryStorage);
        // Create the main dialog.
        const dialog = new userProfileDialog_1.UserProfileDialog(userState);
        const sut = new bot_1.WelcomeDialog(conversationState, userState, dialog);
        // Create conversationUpdate activity
        const conversationUpdateActivity = {
            channelId: 'test channel',
            conversation: {
                id: '1'
            },
            membersAdded: [
                { id: 'Test User' }
            ],
            recipient: { id: 'test recipient' },
            type: botbuilder_1.ActivityTypes.ConversationUpdate
        };
        // Send the conversation update activity to the bot.
        yield processActivity(conversationUpdateActivity, sut);
        // Assert that we started the main dialog.
        let reply = testAdapter.activityBuffer.shift();
        assert.strictEqual(reply.text, constants_1.Constants.welcomeText);
    }));
});
//# sourceMappingURL=welcomeDialog.test.js.map