
const readline = require("readline");

const Bot = require("../bot/index.js");
const bot = new Bot();

const colors = require(`${__dirname}/colors.json`);
const config = require(`${__dirname}/config.json`);
let { style } = config;

for (const color in colors) {
    colors[color] = `\x1b[${colors[color]}m`;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const loop = answer => {
    console.log(`${format("Bot", colors[style.botname])}: ${format(bot.message(answer), colors[style.bottext])}`);
    rl.question(`${format("You", colors[style.usrname])}: ${colors[style.usrtext]}`, loop);
};

const format = (string, ...color) => {
    return `${colors.reset}${color.join("")}${string}${colors.reset}`;
};

loop("Hello");