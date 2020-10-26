
const fs = require("fs");
const srcs = fs.readdirSync(`${__dirname}/srcs/`);

class Wrapper {
    static async get(name, src) {
        return await this[src](name);
    }
}

srcs.forEach(file => {
    Wrapper[file.slice(0, -3)] = require(`${__dirname}/srcs/${file}`);
});

module.exports = Wrapper;