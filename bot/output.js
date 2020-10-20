const config = require("./config.json");

module.exports = class {
    constructor() {
        this.out = [];
        this.df = [];
        this.debug = [];

        this.allowDebug = config.debug;
        return this;
    }

    addOutput (...args) {
        this.out.push(...args);
        return this;
    }

    dfIO (...args) {
        this.df.push(...args);
    }

    addDf (...args) {
        this.dfIO(...args);
        return this;
    }

    addDebug (...args) {
        this.debug.push(...args);
        return this;
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