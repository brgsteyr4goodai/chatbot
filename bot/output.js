const config = require("./config.json");

/**
 * Output class
 */
class Output {
    /**
     * @private
     * @returns {Output}
     */
    constructor() {
        this.out = [];
        this.df = [];
        this.debug = [];

        this.optionsObject = {};

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
    addDf (...args) {
        this.df.push(...args);
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
     * Returns object containing functions for modifying options
     * @type {Object}
     * @property {function(string, any)} setProperty
     * @property {function(object)} setDialogflow
     * @property {function(object)} setStyle
     */
    get options () {
        return {
            setProperty : (prop, value) => this.optionsObject[prop] = value,
            setDialogflow : (dfObject) => this.optionsObject.dfObject = dfObject,
            setStyle : (styleObject) => this.optionsObject.style = styleObject
        }
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
            debug : this.debug,
            options : this.optionsObject
        }
    }
}

/**
 * Exports
 */
module.exports = Output;