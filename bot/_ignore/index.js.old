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
        this.path = this.client.projectAgentSessionPath(config.projectID, this.sessionId);

        this.start();
    }

    start() {
        this.symptoms = [];
        this.causes = [];
    }

    async message(msg, ts = Date.now()) {

        if (!msg || typeof msg !== "string") msg = " ";

        // check for cmd

        let pmSymptoms = match.get(msg);
        let dfSymptoms = [];

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
        try {
            if (response.parameters.fields.Symptoms.listValue.values.length > 0) {
                dfSymptoms = response.parameters.fields.Symptoms.listValue.values.map(v => v.stringValue);
            }
        } catch (error) {}

        if (config.useDF) this.addSymptoms(dfSymptoms);
        if (config.usePM) this.addSymptoms(pmSymptoms);

        console.log("df:", dfSymptoms, "  pm:", pmSymptoms, "  symptoms:", this.symptoms);

        if (this.symptoms) {
            this.causes = (await Symptoma.get(this.symptoms, config.languageCode.slice(0, 2))).slice(0, config.maxCauses).map(({ name }) => name);
        }
        
        console.log("causes:", this.causes);

        return reply;
    }

    addSymptoms(symptoms) {
        symptoms.forEach(symptom => {
            if (this.symptoms.indexOf(symptom) === -1) {
                this.symptoms.push(symptom);
            }
        });
    }
}

module.exports = Bot;