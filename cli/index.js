
const fs = require("fs");
const readline = require("readline");

const Bot = require("../bot/index.js");
const bot = new Bot();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class CLI {
    static config = require("./config.json");
    static colors = require("./colors.js");

    static loop = async input => {
        let { config, format } = this;

        if (input.slice(0, config.prefix.length) === config.prefix) {
            let [ cmd, ...args ] = input.slice(config.prefix.length).split(" ");
            
            if (cmds[cmd] !== undefined) {
                cmds[cmd](args);
            }
            else {
                console.log(`${format(`Command ${cmd} not found`, config.errtext)}`);
            }
        }
        else {
            let { debug, df, out } = await bot.message(input);

            if (config.debug && debug.length !== 0) {
                console.log(`${format("[Debug]", config.dbgname)}:`, ...debug);
            }
            if (out.length !== 0) {
                console.log(format(out.join("\n"), config.bottext));
            }
            if (df.length !== 0) {
                console.log(`${format("Bot", config.botname)}:`, format(df.join(" "), config.bottext));
            }
        }

        rl.question(`${format("You", config.usrname)}: ${this.colors[config.usrtext]}`, this.loop);
    };
    
    static format = (string, color) => {
        color = color.constructor.name === "Array" ? color : [ color ];
        return `${this.colors.reset}${color.map(c => this.colors[c]).join("")}${string}${this.colors.reset}`;
    };

    static saveConfig() {
        fs.writeFileSync("./cli/config.json", JSON.stringify(this.config, null, 4));
    }
    
    static start = () => {
        let logo = require("./logo.js");
        console.log(this.format(logo, this.config.botname));
        this.loop("Hello");
    };
}

const cmds = require("./cmds.js")(CLI);
CLI.start();