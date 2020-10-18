module.exports = class {
    constructor() {
        //idk
    }

    getInfo (msg, res) {
        if (data.response.parameters.fields.number.listValue.values.length === 0) return;

        console.log(">> Req on info " +res.map(v => v.numberValue))
    }
}