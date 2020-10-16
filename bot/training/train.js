const config = require(`${__dirname}/../config.json`);
const DialogFlow = require("@google-cloud/dialogflow");
const uuid = require('uuid');

new class {
    constructor() {
        this.client = new DialogFlow.SessionsClient({
            keyFilename : `${__dirname}/credentials/key.json`
        });
        this.sessionId = uuid.v4();
        this.path = this.client.projectAgentSessionPath(config.projectID, this.sessionId)

        this.__setupArgs();
    }

    //---- internal methods

    __setupArgs () {
        this.args = process.argv;
        this.args.shift();
        this.args.shift();

        this.returns = {};

        let cmd = this.args[0];
        if (cmd in this) {
            this[cmd]();
        } else {
            console.log("Invalid command.");
            process.exit(1);
        }
    }

    static __loader (path) {

    }

    //---- commandline methods

    train () {
        console.log(process.argv)
    }

    help () {
        [
            "Command line arguments:",
            "-----",
            "Syntax: <command> <args>",
            "-----",
            "help - shows this message",
            "intent <name> <json location> - adds an intent to the agent",
            "addSyntax <intent name> <json location> - add some training data to an intent",
            "..."
        ].forEach(l => console.log(l))
    }

    intent () {
        console.log("Not implemented yet");
    }

    addSyntax () {

    }
}()
