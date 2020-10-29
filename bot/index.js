const DialogFlow = require("@google-cloud/dialogflow-cx");
const config = require("./config.json");

const DiseaseProcessor = require("./diseaseProcessor.js");
const Output = require("./output.js");
const Flat = require("./cx.flattener.js");

const cmds = {};

/**
 * Main Bot class
 */
class Bot {
    /**
     * Initialize a new instance
     * @param {string} [credentialsPath] Absolute path to file with credentials
     */
    constructor (credentialsPath) {
        if (!credentialsPath) credentialsPath = `${__dirname}/credentials/cx.json`;

        this.client = new DialogFlow.SessionsClient({
            keyFilename : credentialsPath
        });

        this.sessionId = Math.random().toString(36).substring(7);
        this.path = this.client.projectLocationAgentSessionPath(
            config.df.projectID,
            config.df.location,
            config.df.agentId,
            this.sessionId
        );

        this.output = undefined;
        this.instance();
    }

    /**
     * Main function for processing text
     * @param {string} text The message from the user
     * @returns {Promise<Output>}
     */
    async message (text) {
        if (!text || typeof text !== "string") text = " ";

        this.output = new Output();
        let query = this.createQuery([text]);

        if (text.slice(0, config.prefix.length) === config.prefix) {
            let [ cmd, ...args ] = text.slice(1).split(" ");
            cmds[cmd](args);
            return this.output;
        }

        let [response] = await this.client.detectIntent(query);
        this.output.addDf(response.queryResult.responseMessages.map(m => m.text.text).join("\n"))

        let flowName = Flat.executionFlat(response.queryResult)[0]["Step 1"].InitialState.FlowState.Name;
        if (flowName in this) {
            await this[flowName]({
                page : response.queryResult.currentPage.displayName,
                intent: response.queryResult.match.intent ? response.queryResult.match.intent.displayName : "",
                response,
                output: this.output,
                query,
                text
            });
        }

        return this.output;
    }

    /**
     * @private
     */
    instance () {
        this.diseaseProcessor = new DiseaseProcessor(this);
    }

    /**
     * @private
     */
    createQuery(text) {
        return {
            session: this.path,
            queryInput: {
                text: {
                    text
                },
                languageCode: config.df.languageCode
            }
        };
    }

    //--------------------------------------

    /**
     * @private
     */
    async symptom (data) {
        switch (data.page) {
            case "syp:selector":
                if (data.intent === "") return;
                await this.diseaseProcessor.getDisease();
                this.diseaseProcessor.logSymptomsAndCauses();
                break;
        }

        if (!data.response.queryResult.parameters) return;

        switch (data.intent) {
            case "symptom:add":
                await this.diseaseProcessor.message(data.text, data.response.queryResult.parameters.fields.symptom);
                break;
            case "symptom:numberSelector":
                await this.diseaseProcessor.getInfoByNumber(data.response.queryResult.parameters.fields.number.numberValue)
                break;
        }
    }

    /**
     * @private
     */
    async ["Default Start Flow"] (data) {
        switch (data.intent) {
            case "info:start":
                if (!data.response.queryResult.parameters.fields.any.stringValue) return;
                await this.diseaseProcessor.addInfoToOutput(data.response.queryResult.parameters.fields.any.stringValue)
                break;
        }
    }
}

/**
 * Exports
 */
module.exports = Bot;