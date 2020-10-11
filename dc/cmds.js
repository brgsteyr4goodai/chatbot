let botClass = require("../bot/index.js");
const utils = require("./utils.js");
const { MessageEmbed : Embed } = require("discord.js");
const config = require("./config.json");

module.exports = class {
    bind (msg, active) {
        active[utils.chId(msg)] = {
            origin : msg,
            author : msg.author,
            bot : new botClass(),
            pipe : function (msg) {return this.bot.message(msg)}
        }

        msg.channel.send(`Bound @${msg.author.id} in ${msg.channel.id} - bind total ${Object.keys(active).length} (${utils.chId(msg)})`)
    }
    unbind (msg, active) {
        if (utils.chId(msg) in active) {
            if (active[utils.chId(msg)].author.id === msg.author.id) {
                delete active[utils.chId(msg)];
            }
        }

        msg.channel.send("Unbound @"+msg.author.id);
    }
    help (msg, ac, cmd) {
        if (cmd.length < 2) {
            let help = new Embed()
                .setTitle("Help")
                .setDescription(`Use ${config.prefix}help <command> to get info on that command, use ${config.prefix}setup to get basic info on how to use the bot`)
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
    info (msg) {

    }
    setup (msg) {

    }
}
