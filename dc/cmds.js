let botClass = require("../bot/index.js");
const utils = require("./utils.js");

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
}
