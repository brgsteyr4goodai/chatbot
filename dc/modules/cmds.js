let botClass = require("../../bot");
const utils = require("./utils.js");
const Embed = require("ccord").Discord.MessageEmbed;
const config = require("../config.json");
const { contributors } = require("../../package.json");
const { spawnSync } = require("child_process")

module.exports = class {
    listen (msg, active) {
        active[utils.chId(msg)] = {
            origin : msg,
            author : msg.author,
            bot : new botClass(),
            pipe : async function (msg) {return await this.bot.message(msg)}
        }

        let embed = new Embed()
            .setTitle("Now listening to messages in this channel (#"+msg.channel.name+")")
            .setFooter(msg.author.tag, msg.author.displayAvatarURL())

        msg.channel.send(embed);
    }

    silence (msg, active) {
        if (utils.chId(msg) in active) {
            if (active[utils.chId(msg)].author.id === msg.author.id) {
                delete active[utils.chId(msg)];
            }
        }

        let embed = new Embed()
            .setTitle("Stopped listening to messages in this channel (#"+msg.channel.name+")")
            .setFooter(msg.author.tag, msg.author.displayAvatarURL())

        msg.channel.send(embed);
    }

    help (msg, ac, cmd) {
        if (cmd.length < 2) {
            let help = new Embed()
                .setTitle("Help")
                .setDescription(`Use \`${config.prefix}help <command>\` to get info on that command, use \`${config.prefix}setup\` to get basic info on how to use the bot`)
                .addField("Commands", Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(e => e !== "constructor").join("\n"));

            msg.channel.send(help);
            return;
        }

        if (!(cmd[1] in this)) {
            msg.channel.send("This command does not exist.");
            return;
        }

        let commandInfo = new Embed()
            .setTitle("Command <"+cmd[1]+">")
            .setDescription(utils.getHelp(cmd[1]));
        msg.channel.send(commandInfo);
    }

    info (msg, ac, io, client) {
        let embed = new Embed()
            .setTitle("Wilson Chatbot 4goodai")
            .setDescription("Developed for https://www.ada.wien/hackathon-fur-gute-ki-4goodai-2020/")
            .addField("Contributors", contributors.map(({ name }) => name).join("\n"))
            //.addField("Technologies used", ["[Discord.js](https://discord.js.org/#/)", "..."].join("\n"))
            .setFooter(client.user.tag, client.user.displayAvatarURL())

        msg.channel.send(embed);
    }

    setup (msg) {
        let prefix = config.prefix;

        let embed = new Embed()
            .setTitle("Usage")
            .setDescription(`The commands \`${prefix}listen\` and \`${prefix}silence\` allow you to redirect the messages you send to the bot.
            After using \`${prefix}listen\`, all message from issuing user (in this channel) will be redirected to the bot.
            \`${prefix}silence\` removes this message forwarding. 
            `)

        msg.channel.send(embed)
    }

    stats (msg, active) {
        let git

        try {
            git = spawnSync("git", ["rev-list", "--all", "--count"] , { encoding : 'utf8' }).stdout;
        } catch (e) {
            msg.channel.send("Error: Host does not support stats command.");
            return;
        }


        let embed = new Embed()
            .setTitle("Discord statistics")
            .addField("Current bindings", Object.keys(active).length)
            .addField("Available commands", Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(e => e !== "constructor").length)
            .addField("Version", git ? "v" + git : "Not available")

        msg.channel.send(embed)
    }
}
