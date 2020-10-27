const DialogFlow = require("@google-cloud/dialogflow-cx");
const config = require("./config.json");

const DiseaseProcessor = require("./diseaseProcessor.js");
const Output = require("./output.js");

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

    message (text) {
        let output = new Output();

        output.addDf(text);

        return output;
    }

    instance () {
        this.diseaseProcessor = new DiseaseProcessor(this);
    }
}

module.exports = Bot;