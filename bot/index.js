require("./doc/type.js")

const DialogFlow = require("@google-cloud/dialogflow");
const uuid = require('uuid');
const config = require("./config.json");

const DiseaseProcessor = require("./diseaseProcessor.js");
const Output = require("./output.js");

const cmds = {

}

class Bot {
    constructor() {
        this.client = new DialogFlow.SessionsClient({
            keyFilename : `${__dirname}/credentials/df.json`
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

        this.output = new Output();

        if (text.slice(0, config.prefix.length) === config.prefix) {
            let [ cmd, ...args ] = text.slice(1).split(" ");
            cmds[cmd](args);
            return this.output;
        }

        //query dialogflow
        let query = this.createQuery(text);
        let [ response ] = await this.client.detectIntent(query);
        if (response.queryResult.fulfillmentText !== undefined && response.queryResult.fulfillmentText !== "" && response.queryResult.fulfillmentText !== " ") {
            this.output.addDf(response.queryResult.fulfillmentText);
        }

        //pass intent to local function
        let parsed = response.queryResult.intent.displayName.split(":");
        if (parsed[0] in this) {
            await this[parsed[0]](parsed[1], { response, query, text: text })
        }

        console.log(this.output);
        return this.output;
    }

    instance () {
        //create necessary instance of other match here

        this.diseaseProcessor = new DiseaseProcessor(this);
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
                await this.diseaseProcessor.logSymptomsAndCauses();
                break;
            case "postDiagnoseNum":
                await this.diseaseProcessor.getInfoByNumber(data.response);
                break;
        }
    }

    /**
     * @param {string} mode
     * @param {interIO} data
     */
    async cancerinfo (mode, data) {
        switch (mode) {
            case "init":
                await this.diseaseProcessor.getInfoByName(data.response)
                break;
        }
    }
}

module.exports = Bot;