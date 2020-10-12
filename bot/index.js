const config = require(`${__dirname}/config.json`);
const DialogFlow = require("@google-cloud/dialogflow");

class Bot {
    constructor(...args) {

    }

    async message(msg, ts = Date.now()) {
        return msg;                         // for testing
    }
}

module.exports = Bot;