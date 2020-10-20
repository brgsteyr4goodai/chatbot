require("./doc/type.js")

const DialogFlow = require("@google-cloud/dialogflow");
const uuid = require('uuid');
const config = require("./config.json");

const DiseaseProcessor = require("./diseaseProcessor.js");

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

        let intent, pmIntent, dfIntent;
        let query = this.createQuery(text);

        let [ response ] = await this.client.detectIntent(query);
        let reply = response.queryResult.fulfillmentText;

        /* bypass for debugging
        let parsed = response.intent.displayName.split(":");
        if (parsed[0] in this) {
            await this[parsed[0]](parsed[1], {response, query, text : msg})
        }
        dfIntent = parsed;      // inten parsed by dialogflow
        */
        pmIntent = "appendSymptom";

        intent = dfIntent ? dfIntent : pmIntent;

        await this.symptom_io(intent, { response, query, text });

        return reply;
    }

    instance () {
        //create necessary instance of other match here

        this.diseaseProcessor = new DiseaseProcessor();
    }

    //---------------------------- intent_classes

    /**
     * @param {string} mode
     * @param {interIO} data
     */
    async symptom_io (mode, data) {
        switch (mode) {
            default: 
            case "default":
            case "appendSymptom":
                await this.diseaseProcessor.message(data.text, data.response);
                break;
            case "select_number":
                break;
        }
    }

    createQuery(text) {
        return {
            session : this.path,
            queryInput : {
                text : {
                    text,
                    languageCode: config.languageCode
                }
            }
        };
    }
}

module.exports = Bot;