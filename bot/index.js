require("./doc/type.js")

const DialogFlow = require("@google-cloud/dialogflow");
const uuid = require('uuid');
const config = require("./config.json");

const DiseaseProcessor = require("./diseaseProcessor.js");
const Output = require("./output.js");

class Bot {
    constructor() {
        this.client = new DialogFlow.SessionsClient({
            keyFilename : `${__dirname}/dialogflow_credentials/public.json`
        });
        this.sessionId = uuid.v4();
        this.path = this.client.projectAgentSessionPath(config.projectID, this.sessionId);

        this.instance();
    }

    //---------------------------- main

    /**
     * @param text {String}
     */
    async message(text) {
        if (!text || typeof text !== "string") text = " ";
        let output = new Output();

        //query dialogflow
        let query = this.createQuery(text);
        let [ response ] = await this.client.detectIntent(query);
        if (response.queryResult.fulfillmentText !== undefined && response.queryResult.fulfillmentText !== "" && response.queryResult.fulfillmentText !== " ") {
            output.addDf(response.queryResult.fulfillmentText);
        }

        //pass intent to local function
        let parsed = response.queryResult.intent.displayName.split(":");
        if (parsed[0] in this) {
            let additionalStrings = await this[parsed[0]](parsed[1], {response, query, text: text, output})
        }

        return output;
    }

    instance () {
        //create necessary instance of other match here

        this.diseaseProcessor = new DiseaseProcessor();
    }

    /**
     * @param {string} text
     * @returns {queryObject}
     */
    createQuery(text) {
        return {
            session: this.path,
            queryInput: {
                text: {
                    text,
                    languageCode: config.languageCode
                }
            }
        };
    }

    //---------------------------- intent_classes

    /**
     * @param {string} mode
     * @param {interIO} data
     */
    async symptom2 (mode, data) {
        switch (mode) {
            case "init":
            case "add":
                await this.diseaseProcessor.message(data.text, data.response);
                break;
            case "diagnose":
                await this.diseaseProcessor.getDisease();
                await this.diseaseProcessor.logSymptomsAndCauses(data.output);
                break;
            case "postDiagnoseNum":
                await this.diseaseProcessor.getInfo(data.output, data.response);
                break;
        }
    }
}

module.exports = Bot;