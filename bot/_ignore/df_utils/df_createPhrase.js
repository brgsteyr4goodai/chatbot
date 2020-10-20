let json = require("../pm/symptoms.json");

let jArr = json.map(sy => {
    return sy.context.replace("{}", sy.value);
})

module.exports = jArr;
