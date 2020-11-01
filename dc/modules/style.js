const MessageEmbed = require("ccord").Discord.MessageEmbed;

module.exports = class {
    debug (msg, debug) {
        debug.forEach((d, idx) => {
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
    }

    main (msg, reply) {
        let embed = new MessageEmbed()
            .addFields(this.parseOutput(reply.object))
            .addField("Reply", this.parseDialogFlow(reply.object));

        msg.channel.send(embed);
    }

    parseOutput (object) {
        switch (object.options.dfObject.intent) {
            case "symptom:numberSelector":
            case "info:start":
                return object.options.style.output.map(element => {
                    let obj = {
                        name : element[0]
                    };

                    obj.value = object.out[element[1]].slice(0, element[3] - (object.out[element[2]].length + 4)) + `${(object.out[element[1]].length + 4) > element[3] ? "..." : ""}\n` + object.out[element[2]];

                    return obj;
                });

            default:
                return object.options.style.output.map(element => {
                    let obj = {
                        name : element[0]
                    };

                    if (element[2] === -1) element[2] = object.out.length;
                    obj.value = object.out.slice(element[1], element[2]).join("\n").slice(0, element[3]-1);

                    return obj;
                });
        }
    }

    parseDialogFlow (reply) {
        return reply.df.join("\n").slice(0, reply.options.style.df);
    }
}