/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const urls = require('./documents/urls.json');
const steps = require('./documents/steps.json')

var purpose = "not-selected";

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      // If we consider the launch screen and the home screen the same, then let's have
      // the Launch Request Handler also handle the Navigate Home Intent.
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
    );
  },
  handle(handlerInput) {
    const speakOutput = "What would you like to see?";
    var intro_screen = require('./documents/introScreen.json');

    // Check to make sure the device supports APL
    if (
      Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
        'Alexa.Presentation.APL'
      ]
    ) {
      // add a directive to render our simple template
      handlerInput.responseBuilder.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        document: intro_screen,
      });
    }

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const basicUseHandler = {
    canHandle(handlerInput) {
        return (
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'BasicUses') ||
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'Basic')
        );
    },
    handle(handlerInput) {
        const speakOutput = "Select a basic use";
        var basic_uses = require('./documents/basicUses.json');
        
        if (
            Alexa.getSupportedInterfaces(handlerInput.requestEnvelope) [
                'Alexa.Presentation.APL'
            ]
        ) {
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                document: basic_uses,
            });
        }
        
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
          
    }
};

const formatSelectionHandler = {
    canHandle(handlerInput) {
        return (
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'FormatSelection') ||
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'vidselect')
        );
    },
    handle(handlerInput) {
        const speakOutput = "Would you like written instructions or a video?";
        var format_selection = require('./documents/formatSelection.json');
        
        purpose = handlerInput.requestEnvelope.request.arguments[1];
        
        if (
            Alexa.getSupportedInterfaces(handlerInput.requestEnvelope) [
                'Alexa.Presentation.APL'
            ]
        ) {
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                document: format_selection,
            });
        }
        
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
          
    }
};

const videoHandler = {
    canHandle(handlerInput) {
        return (
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'VideoIntent') ||
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'NewsVideo')
        );
    },
    handle(handlerInput) {
        const speakOutput = "Here is a video on " + purpose;
        var video_doc = require('./documents/video.json');
        
        video_doc["mainTemplate"]["items"][0]["items"][1]["source"] = urls[purpose];
        
        if (
            Alexa.getSupportedInterfaces(handlerInput.requestEnvelope) [
                'Alexa.Presentation.APL'
            ]
        ) {
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                document: video_doc
            });
        }
        
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
    }
};

const trySayingHandler = {
    canHandle(handlerInput) {
        return (
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'TrySaying') ||
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'NewsInstructions')
        );
    },
    handle(handlerInput) {
        const speakOutput = "Try saying any of the messages below";
        var inst_doc = require('./documents/trySaying.json');
        
        var listItems = [];
        
        for (var i = 0; i < steps[purpose].length; i++) {
            listItems.push({
                "primaryText": steps[purpose][i]["answer"],
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "Try Saying " + steps[purpose][i]["answer"]
                    }
                ],
                "onPress": [
                    {
                        "type": "SpeakItem",
                        "componentId": "plantList"
                    }
                ]
            })
        }
        
        inst_doc["mainTemplate"]["items"][0]["listItems"] = listItems;
        
        if (
            Alexa.getSupportedInterfaces(handlerInput.requestEnvelope) [
                'Alexa.Presentation.APL'
            ]
        ) {
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                document: inst_doc
            });
        }
        
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
    }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const speakOutput = 'You can say hello to me! How can I help?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.CancelIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          'AMAZON.StopIntent')
    );
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!';

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    const speakOutput = "Sorry, I don't know about that. Please try again.";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      'SessionEndedRequest'
    );
  },
  handle(handlerInput) {
    console.log(
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  },
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  async handle(handlerInput, error) {
    if (handlerInput.requestEnvelope.request.hasOwnProperty('source'))
      console.log(
        'BUTTON CLICK: ' + handlerInput.requestEnvelope.request.arguments[0]
      );
    const speakOutput =
      'Sorry, I had trouble doing what you asked. Please try again.';
    console.log(`~~~~ Error handled: ${await JSON.stringify(error)}`);
    console.log(`~~~~ RequestEnvelope: ${await JSON.stringify(handlerInput.requestEnvelope)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    basicUseHandler,
    formatSelectionHandler,
    videoHandler,
    trySayingHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/hello-world/v1.2')
  .lambda();
