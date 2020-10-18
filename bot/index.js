require("./doc/type.js")

const DialogFlow = require("@google-cloud/dialogflow");
const uuid = require('uuid');
const config = require("./config.json");

const symptomProcessor = require("./dialogflow/symptomProcessor.js");
const diseaseInfo = require("./dialogflow/diseaseInfo.js")

class Bot {
    constructor(...args) {
        this.client = new DialogFlow.SessionsClient({
            keyFilename : `${__dirname}/dialogflow/dialogflow_credentials/public.json`
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

        let parsed = response.intent.displayName.split(":");
        if (parsed[0] in this) {
            await this[parsed[0]](parsed[1], {response, query, text : msg})
        }

        return reply;
    }

    instance () {
        //create necessary instance of other match here

        this.symptomProcessor = new symptomProcessor();
        this.diseaseGetter = new diseaseInfo();
    }

    //---------------------------- intent_classes

    /**
     * @param {string} mode
     * @param {interIO} data
     */
    async symptom_io (mode, data) {
        switch (mode) {
            case "default":
            case "appendSymptom":
                await this.symptomProcessor.message(data.text, data.response)
                break;
            case "select_number":
                this.diseaseGetter.getInfo(data.text, data.response.parameters.fields.number.listValue.values)
                break;
        }
    }
}

module.exports = Bot;