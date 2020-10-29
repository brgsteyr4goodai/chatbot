const config = require("./config.json");

/**
 * Output class
 */
class Output {
    /**
     * @private
     * @returns {exports}
     */
    constructor() {
        this.out = [];
        this.df = [];
        this.debug = [];
        return this;
    }

    /**
     * @private
     */
    addOutput (...args) {
        this.out.push(...args);
        return this;
    }

    /**
     * @private
     */
    dfIO (...args) {
        this.df.push(...args);
    }

    /**
     * @private
     */
    addDf (...args) {
        this.dfIO(...args);
        return this;
    }

    /**
     * @private
     */
    addDebug (...args) {
        if (config.debug) {
            this.debug.push(...args);
        }
        return this;
    }

    /**
     * Get the output in an object
     * @returns {{df: string[], debug: string[], out: string[]}}
     */
    get object () {
        return this.convert();
    }

    /**
     * Get the output in an object
     * @returns {{df: string[], debug: string[], out: string[]}}
     */
    convert () {
        return {
            df : this.df,
            out : this.out,
            debug : this.debug
        }
    }
}

/**
 * Exports
 */
module.exports = Output;