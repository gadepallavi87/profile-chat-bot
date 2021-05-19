// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StatePropertyAccessor, TurnContext, UserState } from 'botbuilder';
import { Constants } from '../common/constants'
import {
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    PromptValidatorContext,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { UserProfile } from '../common/userProfile';


export class UserProfileDialog extends ComponentDialog {
    private userProfile: StatePropertyAccessor<UserProfile>;

    constructor(userState: UserState) {
        super('userProfileDialog');

        this.userProfile = userState.createProperty(Constants.USER_PROFILE);

        this.addDialog(new TextPrompt(Constants.NAME_PROMPT));
        this.addDialog(new ChoicePrompt(Constants.CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(Constants.CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(Constants.NUMBER_PROMPT, this.agePromptValidator));

        this.addDialog(new WaterfallDialog(Constants.WATERFALL_DIALOG, [
            this.nameStep.bind(this),
            this.nameConfirmStep.bind(this),
            this.ageStep.bind(this),
            this.maritalStep.bind(this),
            this.confirmStep.bind(this),
            this.summaryStep.bind(this)
        ]));

        this.initialDialogId = Constants.WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    public async run(turnContext: TurnContext, accessor: StatePropertyAccessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    private async nameStep(stepContext: WaterfallStepContext<UserProfile>) {
        //stepContext.options.marital = stepContext.result.value;
        return await stepContext.prompt(Constants.NAME_PROMPT, Constants.namePrompt);
    }

    private async nameConfirmStep(stepContext: WaterfallStepContext<UserProfile>) {
        stepContext.options.name = stepContext.result;

        // We can send messages to the user at any point in the WaterfallStep.
        await stepContext.context.sendActivity(`Thanks ${stepContext.result}.`);

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await stepContext.prompt(Constants.CONFIRM_PROMPT, Constants.nameConfirmPrompt, Constants.nameConfirmPromptChoices);
    }

    private async ageStep(stepContext: WaterfallStepContext) {
        if (stepContext.result === true) {
            // User said "yes" so we will be prompting for the age.
            // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is a Prompt Dialog.
            const promptOptions = { prompt: Constants.agePrompt, retryPrompt: Constants.ageRetryPrompt };

            return await stepContext.prompt(Constants.NUMBER_PROMPT, promptOptions);
        } else {
            // User said "no" so we will skip the next step. Give -1 as the age.
            return await stepContext.next(-1);
        }
    }

    private async maritalStep(stepContext: WaterfallStepContext<UserProfile>) {
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        // Running a prompt here means the next WaterfallStep will be run when the users response is received.
        stepContext.options.age = stepContext.result;

        const msg = stepContext.options.age === -1 ? 'No age given.' : `I have your age as ${stepContext.options.age}.`;

        // We can send messages to the user at any point in the WaterfallStep.
        await stepContext.context.sendActivity(msg);
        return await stepContext.prompt(Constants.CHOICE_PROMPT, {
            choices: ChoiceFactory.toChoices(Constants.maritalChoices),
            prompt: Constants.maritalPrompt
        });
    }

    private async confirmStep(stepContext: WaterfallStepContext<UserProfile>) {
        
        stepContext.options.marital = stepContext.result.value;
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is a Prompt Dialog.
        return await stepContext.prompt(Constants.CONFIRM_PROMPT, { prompt: Constants.confirmPrompt });
    }

    private async summaryStep(stepContext: WaterfallStepContext<UserProfile>) {
        if (stepContext.result) {
            // Get the current profile object from user state.
            const userProfile = await this.userProfile.get(stepContext.context, new UserProfile());
            const stepContextOptions = stepContext.options;
            userProfile.marital = stepContextOptions.marital;
            userProfile.name = stepContextOptions.name;
            userProfile.age = stepContextOptions.age;

            let msg = `I have your name as ${userProfile.name}, marital status as ${userProfile.marital}.`;
            if (userProfile.age !== -1) {
                msg += ` And age as ${userProfile.age}.`;
            }

            await stepContext.context.sendActivity(msg);
        } else {
            await stepContext.context.sendActivity(Constants.exitMessage);
        }

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is the end.
        return await stepContext.endDialog();
    }

    private async agePromptValidator(promptContext: PromptValidatorContext<number>) {
        // This condition is our validation rule. You can also change the value at this point.
        return promptContext.recognized.succeeded && promptContext.recognized.value > 0 && promptContext.recognized.value < 150;
    }
}
