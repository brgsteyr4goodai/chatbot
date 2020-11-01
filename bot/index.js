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
        let intent = response.queryResult.match.intent ? response.queryResult.match.intent.displayName : "";
        if (flowName in this) {
            await this[flowName]({
                page : response.queryResult.currentPage.displayName,
                intent,
                response,
                output: this.output,
                query,
                text
            });
        }

        this.output.options.setDialogflow({
            intent,
            flow : flowName,
            page : response.queryResult.currentPage.displayName
        });
        this.generateDefaultStyles();

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

    /**
     * @private
     */
    generateDefaultStyles () {
        if (this.output.object.options.style === undefined) {
            this.output.options.setStyle({
                output : [],
                df : 1024
            })
        }
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

                this.output.options.setStyle({
                    output : [["Diagnose", 0, -1, 1024]],
                    df : 1024
                });
                break;
        }

        if (!data.response.queryResult.parameters) return;

        switch (data.intent) {
            case "symptom:add":
                await this.diseaseProcessor.message(data.text, data.response.queryResult.parameters.fields.symptom);
                break;
            case "symptom:numberSelector":
                await this.diseaseProcessor.getInfoByNumber(data.response.queryResult.parameters.fields.number.numberValue)

                let arr = [];
                for (let i = 1; i < this.output.out.length - 1; i += 3) {
                    arr.push([this.output.out[i], i+1, i+2, 1024])
                }

                this.output.options.setStyle({
                    output : arr,
                    df : 1024
                });

                break;
        }
    }

    /**
     * @private
     */
    async ["Default Start Flow"] (data, output) {
        switch (data.intent) {
            case "info:start":
                if (!data.response.queryResult.parameters.fields.any.stringValue) return;
                await this.diseaseProcessor.addInfoToOutput(data.response.queryResult.parameters.fields.any.stringValue)

                let arr = [];
                for (let i = 1; i < this.output.out.length - 1; i += 3) {
                    arr.push([this.output.out[i], i+1, i+2, 1024])
                }

                this.output.options.setStyle({
                    output : arr,
                    df : 1024
                });

                break;
        }
    }
}

/**
 * Exports
 */
module.exports = Bot;