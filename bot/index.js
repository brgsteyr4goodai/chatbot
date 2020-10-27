const DialogFlow = require("@google-cloud/dialogflow-cx");
const config = require("./config.json");

const DiseaseProcessor = require("./diseaseProcessor.js");
const Output = require("./output.js");
const Flat = require("./cx.flattener.js");

const cmds = {};

class Bot {
    constructor () {
        this.client = new DialogFlow.SessionsClient({
            keyFilename : `${__dirname}/credentials/cx.json`
        });

        this.sessionId = Math.random().toString(36).substring(7);
        this.path = this.client.projectLocationAgentSessionPath(
            config.df.projectID,
            config.df.location,
            config.df.agentId,
            this.sessionId
        );

        this.instance();
    }

    async message (text) {
        if (!text || typeof text !== "string") text = " ";

        let output = new Output();
        let query = this.createQuery([text]);

        if (text.slice(0, config.prefix.length) === config.prefix) {
            let [ cmd, ...args ] = text.slice(1).split(" ");
            cmds[cmd](args);
            return this.output;
        }

        let [response] = await this.client.detectIntent(query);

        output.addDf(response.queryResult.responseMessages.map(m => m.text.text).join("\n"))

        if (response.queryResult.match.intent) {
            if (response.queryResult.match.intent.displayName in this) {
                this[response.queryResult.match.intent.displayName](response, output, query, text);
            }
        } else {
            output.addOutput("An internal error occurred.");
        }

        return output;
    }

    instance () {
        this.diseaseProcessor = new DiseaseProcessor(this);
    }

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

    test_intent (response, output) {
        output.addOutput("intent called: "+response.queryResult.match.intent.displayName);
    }
}

module.exports = Bot;