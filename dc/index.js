const cc = require("ccord");
const fs = require("fs");

const config = require(`${__dirname}/config.json`);
const token = fs.readFileSync(`${__dirname}/token.txt`, "utf-8");

new class extends cc {
    constructor() {
        super(token);

        this.active = {};
    }

    async setup () {
        this.cmd = new (require(`./modules/cmds.js`))();
        this.utils = require("./modules/utils.js");
        this.style = new (require("./modules/style.js"))();
    }

    handleCmd (msg) {
        let io = msg.content.slice(config.prefix.length).split(" ");

        if (io[0] in this.cmd) {
            console.log(`${msg.author.tag} ran command ${io[0]}`)

            this.cmd[io[0]](msg, this.active, io, this.bot);
        }
    }

    //events

    ready () {
        this.bot.user.setActivity("Just Chatting", {type: "PLAYING"});
        console.log("Bot is online");
        console.log("config: ", config);
    }

    async message (msg) {
        if (msg.content.startsWith(config.prefix) && !msg.author.bot) {
            this.handleCmd(msg);
            return;
        }

        if (this.utils.chId(msg) in this.active) {
            if (msg.author.id !== this.active[this.utils.chId(msg)].author.id) return;
            let reply = await this.active[this.utils.chId(msg)].pipe(msg.content);

            this.style.debug(msg, reply.debug);
            this.style.main(msg, reply);
        }
    }
}();