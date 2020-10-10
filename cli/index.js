
const readline = require("readline");
const { start } = require("repl");

const Bot = require("../bot/index.js");
const bot = new Bot();

const colors = require(`${__dirname}/colors.json`);
const config = require(`${__dirname}/config.json`);
let { style } = config;
let run;

for (const color in colors) {
    colors[color] = `\x1b[${colors[color]}m`;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cmds = {
    info: {
        info: "Returns info of given command",
        main: cmd => {
            console.log(`\n${format(cmd, colors[style.botname])}\n${cmds[cmd].info}\n`);
        }
    },
    new: {
        info: "Restarts the bot",
        main: () => {
            run = false;
            main();
        }
    },
    exit: {
        info: "Stops the bot and exits the program",
        main: () => {
            process.exit();
        }
    }
}

const loop = answer => {
    let [ cmd, ...args ] = answer.slice(config.prefix.length).split(" ");
    if (answer.slice(0, config.prefix.length) != config.prefix) {
        console.log(`${format("Bot", colors[style.botname])}: ${format(bot.message(answer), colors[style.bottext])}`);
    }
    else if (cmds[cmd] != undefined) {
        cmds[cmd].main(args);
    }
    else {
        console.log(`${format("Bot", colors[style.botname])}: ${format(`Command ${cmd} not found`, colors[style.errtext])}`);
    }
    if (run) {
        rl.question(`${format("You", colors[style.usrname])}: ${colors[style.usrtext]}`, loop);
    }
};

const format = (string, ...color) => {
    return `${colors.reset}${color.join("")}${string}${colors.reset}`;
};

const main = () => {
    run = true;
    loop("Hello");
}

main();