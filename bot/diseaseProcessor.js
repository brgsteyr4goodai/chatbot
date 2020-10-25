const Match = require("./pm/match.js");
const Symptoma = require("./api/symptoma.js");
const { ICD } = require("./api/icd.js");
const Wikipedia = require("./api/wikipedia.js");
const Wrapper = require("./wrapper.js");
const config = require("./config.json");
const icd_creds = require("./credentials/icd.json");
const symptoms = require("./pm/symptoms.json");
const match = new Match(symptoms);
let icd;

(async () => {
    icd = await new ICD(icd_creds.client_id, icd_creds.client_secret);
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
            if (this.symptoms.indexOf(symptom) === -1) {
                this.symptoms.push(symptom);
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
        let name = this.causes[index-1].name;

        this.bot.output.addDebug("\nICD", await Wrapper.get(name, icd));
        this.bot.output.addDebug("\nWikipedia", await Wrapper.get(name, Wikipedia));
        this.bot.output.addOutput(name);
    }

    async getInfoByName (response) {
        if (response.queryResult.parameters.fields.illness === undefined) return;
        let illness = response.queryResult.parameters.fields.illness.stringValue;

        let srcs = [ icd, Wikipedia ];
        let info = [];
        
        srcs = srcs.map(async src => {
            let res = await Wrapper.get(illness, src);
            if (res) {
                info.push(res);
            }
        });
        await Promise.all(srcs);

        this.bot.output.addDebug(Object.fromEntries(info.map(({ src, id, name }) => [ src, { id, name } ])));

        this.bot.output.addOutput("");
        info.forEach(src => {
            this.bot.output.addOutput(`${src.src}:`, src.description, `Read more at: ${src.url.join(", ")}\n`);
        });
    }

    logSymptomsAndCauses () {
        this.bot.output.addOutput("Running a diagnose...");
        this.bot.output.addDebug("Symptoms:", this.symptoms);
        this.bot.output.addOutput("Possible causes: "+this.causes.map(({ name }) => name).join(", "));
    }
}