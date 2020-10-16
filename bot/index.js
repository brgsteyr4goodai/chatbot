const DialogFlow = require("@google-cloud/dialogflow");

const Match = require("./match.js");
const Symptoma = require("./api/symptoma.js");
const config = require("./config.json");
const symptoms = require("./symptoms.json");

const match = new Match(symptoms);

class Bot {
    constructor(...args) {

    }

    async message(msg, ts = Date.now()) {

        // check for cmd

        let symptoms = match.get(msg);
        console.log(symptoms)
    }
}

module.exports = Bot;