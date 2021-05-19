import { ActivityTypes, ConversationState, MemoryStorage, TestAdapter, TurnContext, UserState } from 'botbuilder';
import { WelcomeDialog } from '../bot';
import { UserProfileDialog } from '../dialogs/userProfileDialog';
import { Constants } from '../common/constants';
const assert = require('assert');

describe('DialogAndWelcomeBot', () => {
    const testAdapter = new TestAdapter(async (context) => undefined);

    async function processActivity(activity, bot) {
        const context = new TurnContext(testAdapter, activity);
        await bot.run(context);
    }

    it('Starts main dialog', async () => {
        const memoryStorage = new MemoryStorage();

        // Create conversation state with in-memory storage provider.
        const conversationState = new ConversationState(memoryStorage);
        const userState = new UserState(memoryStorage);

        // Create the main dialog.
        const dialog = new UserProfileDialog(userState);
        const sut = new WelcomeDialog(conversationState, userState, dialog);

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
            type: ActivityTypes.ConversationUpdate
        };

        // Send the conversation update activity to the bot.
        await processActivity(conversationUpdateActivity, sut);

        // Assert that we started the main dialog.
        let reply = testAdapter.activityBuffer.shift();
        assert.strictEqual(reply.text, Constants.welcomeText);
    });
});