const fs = require("fs");
const Discord = require("discord.js");
const { Client } = Discord;

const config = require(`${__dirname}/config.json`);
const token = fs.readFileSync(`${__dirname}/token.txt`, "utf-8");
const cmd = new (require(`${__dirname}/cmds.js`))();
const utils = require("./utils.js");

let bot = new Client();
let active = {};

bot.on("ready", async () => {
    bot.user.setActivity("Just Chatting", { type: "PLAYING" });
    console.log("Bot is online");
    console.log("config: ", config);
});

bot.on("message", (msg) => {
    //commands
    if (msg.content.startsWith(config.prefix) && !msg.author.bot) {
        let io = msg.content.slice(config.prefix.length).split(" ");

        if (io[0] in cmd) {
            cmd[io[0]](msg, active, io, bot);
        }

        return;
    }

    //bot io
    if (utils.chId(msg) in active) {
        if (msg.author.id !== active[utils.chId(msg)].author.id) return;

        let reply = active[utils.chId(msg)].pipe(msg.content);
        msg.channel.send("Chatbot> "+reply);
    }
})

bot.login(token);