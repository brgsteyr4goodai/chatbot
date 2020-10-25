const Match = require("./pm/match.js");
const Symptoma = require("./api/symptoma.js");
const { ICD, ICDRes } = require("./api/icd.js");
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
    constructor() {
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

    async getInfoByNumber (output, response) {
        if (response.queryResult.parameters.fields.number === undefined) return;
        let index = response.queryResult.parameters.fields.number.listValue.values[0].numberValue;
        let name = this.causes[index-1].name;

        output.addDebug("\nICD", await Wrapper.get(name, icd));
        output.addDebug("\nWikipedia", await Wrapper.get(name, Wikipedia));
        output.addOutput(name);
    }

    async getInfoByName (output, response) {
        if (response.queryResult.parameters.fields.illness === undefined) return;
        let illness = response.queryResult.parameters.fields.illness.stringValue;

        let info = [];

        info.push(await Wrapper.get(illness, icd));
        info.push(await Wrapper.get(illness, Wikipedia));

        output.addDebug(Object.fromEntries(info.map(({ src, id, name }) => [ src, { id, name } ])));

        output.addOutput("");
        info.forEach(src => {
            output.addOutput(`${src.src}:`, src.description, `Read more at: ${src.url.join(", ")}\n`);
        });
    }

    logSymptomsAndCauses (output) {
        output.addOutput("Running a diagnose...");
        output.addDebug("Symptoms:", this.symptoms);
        output.addOutput("Possible causes: "+this.causes.map(({ name }) => name).join(", "));
    }
}