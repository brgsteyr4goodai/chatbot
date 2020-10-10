
const readline = require("readline");

const Bot = require("../bot/index.js");
const bot = new Bot();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const loop = answer => {
    console.log(`Bot: ${bot.message(answer)}`);
    rl.question("You: ", loop);
};

loop("Hello");