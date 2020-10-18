require("./doc/type.js")

const DialogFlow = require("@google-cloud/dialogflow");
const uuid = require('uuid');
const config = require("./config.json");

const symptomProcessor = require("./dialogflow/symptomProcessor.js");

class Bot {
    constructor(...args) {
        this.client = new DialogFlow.SessionsClient({
            keyFilename : `./dialogflow/dialogflow_credentials/public.json`
        });
        this.sessionId = uuid.v4();
        this.path = this.client.projectAgentSessionPath(config.projectID, this.sessionId);

        this.instance();
    }

    //---------------------------- main

    /**
     * @param msg {String}
     */
    async message(msg) {
        if (!msg || typeof msg !== "string") msg = " ";

        let query = {
            session : this.path,
            queryInput : {
                text : {
                    text : msg,
                    languageCode: config.languageCode
                }
            }
        };

        let response = await this.client.detectIntent(query);
        response = response[0].queryResult;
        let reply = response.fulfillmentText;

        if (response.intent.displayName in this) {
            await this[response.intent.displayName]({response, query, text : msg});
        }

        return reply;
    }

    instance () {
        //create necessary instance of other match here

        this.symptomProcessor = new symptomProcessor();
    }

    //---------------------------- intent_classes

    /**
     * @param data {interIO}
     */
    async symptom_io (data) {
        if (data.response.parameters.fields.Symptoms.listValue.values.length > 0) {
            await this.symptomProcessor.message(data.text, data.response)
        }
    }
}

module.exports = Bot;