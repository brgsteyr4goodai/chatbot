const help = require("./help.js")

module.exports = {
    id : (user, channel) => "" + user.id + channel.id,
    chId : function (msg) {
        return this.id(msg.author, msg.channel)
    },
    getHelp : (name) => {
      if (name in help) {
          return help[name];
      } else {
          return "No help message"
      }
    }
}
