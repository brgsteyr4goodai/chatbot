const fs = require("fs");
const Discord = require("discord.js");
const { Client } = Discord;

const config = require(`${__dirname}/config.json`);
const token = fs.readFileSync(`${__dirname}/token.txt`, "utf-8");
const cmd = new (require(`./modules/cmds.js`))();
const utils = require("./modules/utils.js");

let bot = new Client();
let active = {};

bot.on("ready", async () => {
    await bot.user.setActivity("Just Chatting", {type: "PLAYING"});
    console.log("Bot is online");
    console.log("config: ", config);
});

bot.on("message", async (msg) => {
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

        let reply = await active[utils.chId(msg)].pipe(msg.content);

        //future code
        //reply.forEach(r => msg.channel.send("Chatbot > "+r));
        //msg.channel.send("Chatbot > "+reply);

        reply.debug.forEach((d, idx) => {
            if (idx === 0) {
                msg.channel.send("[Debug]")
            }

            let string = "";

            switch (typeof d) {
                case "object":
                    string += "```js\n"
                        + JSON.stringify(d, null, 2).slice(0, 1999 - 3 + 5 + 1)
                        + "```";
                    break;
                default:
                    string += d;
                    string = string.slice(0, 1999);
            }

            msg.channel.send(string)
        });

        let embed = new Discord.MessageEmbed().setColor("#03fcec")
        if (reply.out.length > 0) {
            embed.setDescription(reply.out.join("\n"))
        }

        if (reply.df.length > 0) {
            embed.addField("Reply", reply.df.join("\n"));
        }


        msg.channel.send(embed)
    }
})

bot.login(token);