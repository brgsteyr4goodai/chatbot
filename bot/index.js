const DialogFlow = require("@google-cloud/dialogflow");

const Match = require("./match.js");
const uuid = require('uuid');
const Symptoma = require("./api/symptoma.js");
const config = require("./config.json");
const symptoms = require("./symptoms.json");

const match = new Match(symptoms);

class Bot {
    constructor(...args) {
        this.client = new DialogFlow.SessionsClient({
            keyFilename : `${__dirname}/credentials/public.json`
        });
        this.sessionId = uuid.v4();
        this.path = this.client.projectAgentSessionPath(config.projectID, this.sessionId)
    }

    async message(msg, ts = Date.now()) {

        // check for cmd

        let symptoms = match.get(msg);
        console.log(symptoms)
        if (typeof msg !== "string") {
            throw "Invalid type passed to message";
        }

        let query = {
            session : this.path,
            queryInput : {
                text : {
                    text : msg,
                    languageCode: config.languageCode
                }
            }
        }

        let response = await this.client.detectIntent(query);
        response = response[0].queryResult;

        let reply = response.fulfillmentText;
        try {
            if (response.parameters.fields.Symptoms.listValue.values.length > 0) {
                reply += `  >> Symptom Params: ${JSON.stringify(response.parameters.fields.Symptoms.listValue.values.map(v => v.stringValue))}`
            }
        } catch (e) {}

        return reply;
    }
}

module.exports = Bot;