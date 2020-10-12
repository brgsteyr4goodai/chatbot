
const config = require(`${__dirname}/config.json`);

class Bot {
    constructor(...args) {

    }

    async message(msg, ts = Date.now()) {
        return msg;                         // for testing
    }
}

module.exports = Bot;