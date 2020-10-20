const config = require("./config.json");

module.exports = class {
    constructor() {
        this.out = [];
        this.df = [];
        this.debug = [];

        this.allowDebug = config.debug;
    }

    addOutput (...args) {
        this.out.push(...args);
    }

    dfIO (...args) {
        this.df.push(...args);
    }

    addDf (...args) {
        this.dfIO(...args);
    }

    addDebug (...args) {
        this.debug.push(...args);
    }

    get object () {
        return this.convert();
    }

    convert () {
        return {
            df : this.df,
            output : this.output,
            debug : this.debug
        }
    }
}