module.exports = {
    id : (user, channel) => "" + user.id + channel.id,
    chId : function (msg) {
        return this.id(msg.author, msg.channel)
    }
}
