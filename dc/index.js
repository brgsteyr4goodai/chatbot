
const fs = require("fs");
const Discord = require("discord.js");
const { Client } = Discord;

const config = require(`${__dirname}/config.json`);
const token = fs.readFileSync(`${__dirname}/token.txt`, "utf-8");

let bot = new Client();

bot.on("ready", async () => {
    bot.user.setActivity("Just Chatting", { type: "PLAYING" });
    console.log("Bot is online");
    console.log("config: ", config);
});

bot.login(token);