/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const urls = require('./documents/urls.json');
const steps = require('./documents/steps.json')

// These Alexa uses do not have instructions created by the Human Factors and Aging Laboratory
const notImplementedYet = ["bulb", "plug", "book", "call", "drop", "phonelink", "chitchat"];

// These Alexa uses only have enumerated steps rather than suggestions on what to say to the Alexa device
const stepsOnly = ["bulb", "plug", "book", "call", "drop"];

// This is the Alexa that the app will guide the user through
// For now, we set this to be unselected
var purpose = "not-selected";

/** 
 * This is the handler that will open when the user says "Alexa Open User Manuals"
 * This shall serve as the initial gateway into the application
 */
const LaunchRequestHandler = {
  /** Check whether this handler matches user input
   * 
   * @param {Object} handlerInput Compressed user input data
   * @returns Boolean determining whether this is the handler to be triggered based on user input
   */
  canHandle(handlerInput) {
    return (
      // If we consider the launch screen and the home screen the same, then let's have
      // the Launch Request Handler also handle the Navigate Home Intent.
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest' ||
      (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
            handlerInput.requestEnvelope.request.arguments[0] === 'intro')    
    );
  },

  /** Process user input
   * 
   * @param {Object} handlerInput Compressed user input data
   * @returns Alexa response object based on user input
   */
  handle(handlerInput) {
    const speakOutput = "What would you like to see?";

    /* 
    GUI response to open upon triggering this handler.

    NOTE: In Alexa development, GUI responses are written in Alexa Presentation Language (APL). This is a DOM like language (like HTML),
          where components are stored in a JSON file format. For more reference, visit the link below:

            https://developer.amazon.com/en-US/docs/alexa/alexa-design/apl.html
    */
    var intro_screen = require('./documents/introScreen.json');

    // Check to make sure the device supports APL
    if (
      Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
        'Alexa.Presentation.APL'
      ]
    ) {
      // add a directive to render our simple template
      handlerInput.responseBuilder.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',  // Render the json document above
        document: intro_screen,
      });
    }

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/**
 * This is a handler for the event that the user needs help with a basic use.
 * Examples of basic uses include "Checking the Weather", "Making a Grocery List", etc.
 */
const basicUseHandler = {
    /** Check whether this handler matches user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Boolean determining whether this is the handler to be triggered based on user input
     */
    canHandle(handlerInput) {
        // Either the user had triggered this event through one of the speech triggers set in the graphical developer interface
        // Or an APL has been triggered through a button selection on the GUI
        return (
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'BasicUses') ||                     // Speech trigger
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'Basic')                            // GUI trigger
        );
    },

    /** Process user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Alexa response object based on user input
     */
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

/**
 * This is a handler for format selection.
 * i.e. the screen that asks the user whether the instructions should be in a video or a verbal step by step format
 */
const formatSelectionHandler = {
    /** Check whether this handler matches user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Boolean determining whether this is the handler to be triggered based on user input
     */
    canHandle(handlerInput) {
        return (
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'FormatSelection') ||
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'vidselect')
        );
    },

    /** Process user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Alexa response object based on user input
     */
    handle(handlerInput) {
        const speakOutput = "Would you like written instructions or a video?";
        var format_selection = require('./documents/formatSelection.json');
        
        // Set purpose to be the Alexa use specified from the previous command given by the user
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

/**
 * This handler will play an instructional video on the purpose specified by the user.
 */
const videoHandler = {
    /** Check whether this handler matches user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Boolean determining whether this is the handler to be triggered based on user input
     */
    canHandle(handlerInput) {
        return (
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'VideoIntent') ||
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'NewsVideo')
        );
    },

    /** Process user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Alexa response object based on user input
     */
    handle(handlerInput) {
        // If a video has not been implemented yet by the Human Factors and Aging Laboratory, give the following message
        // NOTE: this is subject to change as HFA WILL upload more videos!
        if (notImplementedYet.includes(purpose)) {
            return handlerInput.responseBuilder
                .speak("Sorry, we do not have a video yet for setting up your " + purpose + ". Please come back later when we create one!")
                .reprompt("Sorry, we do not have a video yet for setting up your " + purpose + ". Please come back later when we create one!")
                .getResponse();
        }

        const speakOutput = "Here is a video on " + purpose;
        var video_doc = require('./documents/video.json');
        

        // Load the url to the video and inject it into the media player GUI's APL data
        video_doc["mainTemplate"]["items"][0]["items"][2]["source"] = urls[purpose];
        
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

/**
 * This handler is for lists of possible things to say to the Alexa.
 * 
 * Alexa will give a list of things to say such as 
 * 
 *   "Try saying, Alexa what will the weather be like today?"
 * 
 * And the user can try saying those things.
 */
const trySayingHandler = {
    /** Check whether this handler matches user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Boolean determining whether this is the handler to be triggered based on user input
     */
    canHandle(handlerInput) {
        return (
            // First step, Verbal input
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'TrySaying') ||

            // First step, GUI input
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'NewsInstructions') ||

            // Next step, GUI input
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'stepnext') ||

            // Previous step, GUI input
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'stepback')
        );
    },

    /** Process user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Alexa response object based on user input
     */
    handle(handlerInput) {
        // If the use specified for instructions doesn't just include steps
        if (!(stepsOnly.includes(purpose))) {
            const speakOutput = "Try saying any of the messages below";
            var inst_doc = require('./documents/trySaying.json');
            
            // List of json APL data for each possible saying to the Alexa 
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
            
            // Inject list items into the GUI APL layout
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
        } else {
            // If this is steps only, have step cards that allow the user to click ahead and back
            const card_doc = require('./documents/stepCard.json');
            
            // Direction to move index of steps in given the user input (next/back)
            var mover = 1;
            if (handlerInput.requestEnvelope.request.arguments[1] === 'back') {
                mover = -1;
            }
            
            // Increment steps by the mover
            var atts = handlerInput.attributesManager.getSessionAttributes();
            if (atts.hasOwnProperty('cheeseno')) {
                atts.cheeseno += mover;
                if (atts.cheeseno === -1) atts.cheeseno = 0;
            } else {
                atts.cheeseno = 0;
            }
            
            // If index is out of range, we are done listing steps
            if (atts.cheeseno === steps[purpose].length) {
                return handlerInput.responseBuilder
                    .speak("Have fun using your smart " + purpose + "!")
                    .reprompt("Have fun using your smart " + purpose + "!")
                    .getResponse();
            }
            
            // Inject current step data into the GUI APL layout
            var doc_data = steps[purpose][atts.cheeseno];
            handlerInput.attributesManager.setSessionAttributes(atts);
            
            card_doc["mainTemplate"]["items"][0]["imageSource"] = doc_data["image"];
            card_doc["mainTemplate"]["items"][0]["bodyText"] = doc_data["step"];
            
            // Change title to gramatically match the current use in the title
            if (purpose === 'plug' || purpose === 'bulb') {
                card_doc["mainTemplate"]["items"][0]["headerTitle"] = "Setting up your smart " + purpose;
            } else {
                card_doc["mainTemplate"]["items"][0]["headerTitle"] = purpose;
            }
            
            // Read out current step
            var speakOutput = doc_data["step"];
            
            if (
                Alexa.getSupportedInterfaces(handlerInput.requestEnvelope) [
                    'Alexa.Presentation.APL'
                ]
            ) {
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .addDirective({
                        type: 'Alexa.Presentation.APL.RenderDocument',
                        token: 'StepToken',
                        document: card_doc
                    })
                    .addDirective({
                        type: 'Alexa.Presentation.APL.ExecuteCommands',
                        token: 'StepToken',
                        commands: [
                          {
                            type: 'Scroll',
                            componentId: 'mainScreen',
                            highlightMode: 'line',
                          }
                        ],
                    })
                    .getResponse();
            }
            
            return handlerInput.responseBuilder
              .speak(speakOutput)
              .reprompt(speakOutput)
              .getResponse();
        }
    }
};

/**
 * Handler for the environmental controls menu
 * 
 * This is for help using devices such as the Ring Doorbell, or Philips Hue Bulb
 */
const envControlHandler = {
    /** Check whether this handler matches user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Boolean determining whether this is the handler to be triggered based on user input
     */
    canHandle(handlerInput) {
        return (
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'EnvControls') ||
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'Environment')
        );
    },

    /** Process user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Alexa response object based on user input
     */
    handle(handlerInput) {
        const speakOutput = "Select a device";
        
        var env_doc = require('./documents/envControls.json');
        
        // Check to make sure the device supports APL
        if (
          Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
            'Alexa.Presentation.APL'
          ]
        ) {
          // add a directive to render our simple template
          handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: env_doc,
          });
        }
    
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
    }
}

/**
 * Handler for the social communications menu
 * 
 * This is for help using Alexa features such as Calling and Video Conferencing
 */
const SocialCommHandler = {
    /** Check whether this handler matches user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Boolean determining whether this is the handler to be triggered based on user input
     */
    canHandle(handlerInput) {
        return (
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'SocialComm') ||
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'Social')
        );
    },

    /** Process user input
     * 
     * @param {Object} handlerInput Compressed user input data
     * @returns Alexa response object based on user input
     */
    handle(handlerInput) {
        const speakOutput = "Select an application";
        
        var soc_doc = require('./documents/socialComm.json');
        
        // Check to make sure the device supports APL
        if (
          Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
            'Alexa.Presentation.APL'
          ]
        ) {
          // add a directive to render our simple template
          handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: soc_doc,
          });
        }
    
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
    }
}

const RecoCardHandler = {
    canHandle(handlerInput) {
        return (
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'RecoCar') ||
            (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent' &&
                handlerInput.requestEnvelope.request.arguments[0] === 'reco')
        );
    },
    handle(handlerInput) {
        purpose = handlerInput.requestEnvelope.request.arguments[1];
        const speakOutput = steps[purpose]["text"];
        var reco_doc = require('./documents/recoCard.json');
        
        reco_doc["mainTemplate"]["items"][0]["imageSource"] = steps[purpose]["image"];
        reco_doc["mainTemplate"]["items"][0]["primaryText"] = steps[purpose]["title"];
        reco_doc["mainTemplate"]["items"][0]["secondaryText"] = steps[purpose]["text"];
        reco_doc["mainTemplate"]["items"][0]["button1PrimaryAction"][0]["source"] = steps[purpose]["link"];
        
        // Check to make sure the device supports APL
        if (
          Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
            'Alexa.Presentation.APL'
          ]
        ) {
          // add a directive to render our simple template
          handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: reco_doc,
          });
        }
    
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
    }
}

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
    envControlHandler,
    SocialCommHandler,
    RecoCardHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/hello-world/v1.2')
  .lambda();
