const Match = require("./pm/match.js");
const Symptoma = require("./api/symptoma.js");
const config = require("./config.json");
const symptoms = require("./pm/symptoms.json");
const match = new Match(symptoms);


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

    getInfo(output, response) {
        if (response.queryResult.parameters.fields.number === undefined) return;
        let index = response.queryResult.parameters.fields.number.listValue.values[0].numberValue;


        output.addOutput(this.causes[index-1].name)
    }

    logSymptomsAndCauses (output) {
        output.addOutput("Running a diagnose...");
        output.addDebug("Symptoms:", this.symptoms);
        output.addOutput("Possible causes: "+this.causes.map(({ name }) => name).join(", "));
    }
}