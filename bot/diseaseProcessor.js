const Match = require("./pm/match.js");
const Symptoma = require("./api/symptoma.js");
const Wrapper = require("./wrapper.js");
const config = require("./config.json");
const symptoms = require("./pm/symptoms.json");
const match = new Match(symptoms);

let srcs = require("./srcs.js");

(async () => {
    srcs = await Promise.all(srcs);
})();

module.exports = class {
    constructor(bot) {
        this.bot = bot;
        this.symptoms = [];
        this.causes = [];
    }

    async message (msg, response) {
        let pmSymptoms = match.get(msg);

        let dfSymptoms = [];
        if (response.queryResult.parameters.fields.Symptoms !== undefined) {
            if (response.queryResult.parameters.fields.Symptoms.listValue.values.length > 0) {
                dfSymptoms = response.queryResult.parameters.fields.Symptoms.listValue.values.map(v => v.stringValue);
            }
        }

        if (config.useDF) this.addSymptoms(dfSymptoms);
        if (config.usePM) this.addSymptoms(pmSymptoms);
    }

    addSymptoms(symptoms) {
        symptoms.forEach(symptom => {
            if (this.symptoms.indexOf(symptom.toLowerCase()) === -1) {
                this.symptoms.push(symptom.toLowerCase());
            }
        });
    }

    async getDisease() {
        this.causes = (await Symptoma.get(this.symptoms, config.languageCode.slice(0, 2))).slice(0, config.maxCauses);
    }

    //------------------------ output

    async getInfoByNumber (response) {
        if (response.queryResult.parameters.fields.number === undefined) return;
        let index = response.queryResult.parameters.fields.number.listValue.values[0].numberValue;
        let illness = this.causes[index-1].name;

        await this.addInfoToOutput(illness);
    }

    async getInfoByName (response) {
        if (response.queryResult.parameters.fields.illness === undefined) return;
        let illness = response.queryResult.parameters.fields.illness.stringValue;

        await this.addInfoToOutput(illness);
    }

    async addInfoToOutput(illness) {
        let info = [];
        await Promise.all(srcs.map(async src => {
            let res = await Wrapper.get(illness, src);
            if (res) {
                info.push(res);
            }
        }));

        this.bot.output.addDebug(Object.fromEntries(info.map(({ src, id, name }) => [ src, { id, name } ])));

        this.bot.output.addOutput("");
        info.forEach(src => {
            this.bot.output.addOutput(`${src.src}:`, src.description, `Read more at: ${src.url.join(" , ")}\n`);
        });
    }

    logSymptomsAndCauses () {
        this.bot.output.addOutput("Running a diagnose...");
        this.bot.output.addDebug("Symptoms:", this.symptoms);
        this.bot.output.addOutput("Possible causes: "+this.causes.map(({ name }) => name).join(", "));
    }
}