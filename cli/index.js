
const fs = require("fs");
const readline = require("readline");

const Bot = require("../bot/index.js");
const bot = new Bot();

const colors = require(`${__dirname}/colors.json`);
let config = require(`${__dirname}/config.json`);

const logo = fs.readFileSync(`${__dirname}/logo.txt`, "utf-8");

for (const color in colors) {
    colors[color] = `\x1b[${colors[color]}m`;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cmds = {
    config: {
        info: "Changes given option to given value",
        main: ([ option, value ]) => {
            if (option === undefined) {
                console.log(`${format("options", config.botname)}`);
                for (const key in config) {
                    console.log(key);
                }
                return;
            }
            if (config[option] === undefined) {
                return console.log(`${format(`Invalid option ${option}`, config.errtext)}`);
            }
            if (value === undefined || value === "") {
                return console.log(`${format(`No value given`, config.errtext)}`);
            }
            try {
                value = JSON.parse(value);
            }
            catch(error) { }
            config[option] = value;
            fs.writeFileSync(`${__dirname}/config.json`, JSON.stringify(config, null, 2));
        }
    },
    info: {
        info: "Returns info of given command",
        main: ([ cmd ]) => {
            if (cmd == undefined) {
                for (const command in cmds) {
                    cmds.info.main([ command ]);
                }
                return;
            }
            if (cmds[cmd] != undefined) {
                return console.log(`${format(cmd, config.botname)}\n${cmds[cmd].info}`);
            }
            console.log(`${format(`Can't find info for command ${cmd}`, config.errtext)}`);
        }
    },
    new: {
        info: "Restarts the bot",
        main: () => {
            main();
        }
    },
    exit: {
        info: "Stops the bot and exits the program",
        main: () => {
            process.exit();
        }
    }
};

const loop = answer => {
    let [ cmd, ...args ] = answer.slice(config.prefix.length).split(" ");
    if (answer.slice(0, config.prefix.length) != config.prefix) {
        console.log(`${format("Bot", config.botname)}: ${format(bot.message(answer), config.bottext)}`);
    }
    else if (cmds[cmd] != undefined) {
        cmds[cmd].main(args);
    }
    else {
        console.log(`${format(`Command ${cmd} not found`, config.errtext)}`);
    }
    rl.question(`${format("You", config.usrname)}: ${colors[config.usrtext]}`, loop);
};

const format = (string, color) => {
    color = color.constructor.name === "Array" ? color : [ color ]; 
    return `${colors.reset}${color.map(c => colors[c]).join("")}${string}${colors.reset}`;
};

const main = () => {
    console.log(format(logo, config.botname));
    loop("Hello");
};

main();