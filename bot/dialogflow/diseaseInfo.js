module.exports = class {
    constructor() {
        //idk
    }

    getInfo (msg, res) {
        console.log(">> Req on info " +res.map(v => v.numberValue))
    }
}