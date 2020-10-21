
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
        let [ cmd, ...args ] = input.slice(config.prefix.length).split(" ");
        if (input.slice(0, config.prefix.length) != config.prefix) {
            let output = await bot.message(input);
            if (config.debug && output.debug.length !== 0) console.log(`${format("[Debug]", config.dbgname)}: ${format(output.debug, config.dbgtext)}`);
            if (output.df.length !== 0) console.log(`${format("Bot", config.botname)}: ${format(output.df[0], config.bottext)}`);
            if (output.out.length !== 0) console.log(`${format(output.out.join("\n"), config.bottext)}`);
        }
        else if (cmds[cmd] != undefined) {
            cmds[cmd](args);
        }
        else {
            console.log(`${format(`Command ${cmd} not found`, config.errtext)}`);
        }
        rl.question(`${format("You", config.usrname)}: ${this.colors[config.usrtext]}`, this.loop);
    };
    
    static format = (string, color) => {
        let { colors } = this;
        color = color.constructor.name === "Array" ? color : [ color ]; 
        return `${colors.reset}${color.map(c => colors[c]).join("")}${string}${colors.reset}`;
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