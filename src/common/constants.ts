export const Constants = {
    CHOICE_PROMPT: 'CHOICE_PROMPT',
    CONFIRM_PROMPT: 'CONFIRM_PROMPT',
    NAME_PROMPT: 'NAME_PROMPT',
    NUMBER_PROMPT: 'NUMBER_PROMPT',
    USER_PROFILE: 'USER_PROFILE',
    WATERFALL_DIALOG: 'WATERFALL_DIALOG',
    
    //text constants
    welcomeText: 'Hello and welcome to user profile chatbot!',
    echoText: 'Echo:',
    namePrompt: 'What is your name, human?',
    nameConfirmPrompt: 'Do you want to give your age?',
    nameConfirmPromptChoices: ['yes', 'no'],
    maritalPrompt: 'Please enter your marital status.',
    maritalChoices: ['Single', 'Married/Remarried', 'Separated', 'Divorced/Widowed'],
    agePrompt: 'Please enter your age.',
    ageRetryPrompt: 'The value entered must be greater than 0 and less than 150.',
    exitMessage: 'Thanks. Your profile will not be kept.',
    confirmPrompt: 'Should we proceed to create your profile with this information?',
};
