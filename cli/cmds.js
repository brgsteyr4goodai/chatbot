
function Command(cmd, info) {
    return Object.assign(cmd, { info });
}

module.exports = CLI => {
    let { config, format } = CLI;
    let cmds = {
        config: Command(
            ([ option, value ]) => {
                if (option === undefined) {
                    console.log(`${format("options", config.botname)}`);
                    for (const key in config) {
                        console.log(key);
                    }
                    return;
                }
                if (config[option] === undefined) {
                    return console.log(`${format(`Invalid option ${option}`, config.errtext)}`);
                }
                if (value === undefined || value === "") {
                    return console.log(`${format(`No value given`, config.errtext)}`);
                }
                try {
                    value = JSON.parse(value);
                }
                catch(error) { }
                config[option] = value;
                CLI.saveConfig();
            },
            "Changes given option to given value"
        ),
        info: Command(
            ([ cmd ]) => {
                if (cmd == undefined) {
                    for (const command in cmds) {
                        cmds.info([ command ]);
                    }
                    return;
                }
                if (cmds[cmd] != undefined) {
                    return console.log(`${format(cmd, config.botname)}\n${cmds[cmd].info}`);
                }
                console.log(`${format(`Can't find info for command ${cmd}`, config.errtext)}`);
            },
            "Returns info of given command"
        ),
        new: Command(
            () => {
                CLI.start();
            },
            "Restarts the bot"
        ),
        exit: Command(
            () => {
                process.exit();
            },
            "Stops the bot and exits the program"
        )
    };
    return cmds;
};