const Match = require("../match/match.js");
const Symptoma = require("../api/symptoma.js");
const config = require("../config.json");
const symptoms = require("../match/symptoms.json");
const match = new Match(symptoms);

module.exports = class {
    constructor() {
        this.symptoms = [];
        this.causes = [];
    }

    async message (msg, response) {
        if (response.parameters.fields.Symptoms.listValue.values.length === 0) return;

        let pmSymptoms = match.get(msg);
        let dfSymptoms = [];

        if (response.parameters.fields.Symptoms.listValue.values.length > 0) {
            dfSymptoms = response.parameters.fields.Symptoms.listValue.values.map(v => v.stringValue);
        }

        if (config.useDF) this.addSymptoms(dfSymptoms);
        if (config.usePM) this.addSymptoms(pmSymptoms);

        console.log("df:", dfSymptoms, "  pm:", pmSymptoms, "  symptoms:", this.symptoms);

        if (this.symptoms) {
            this.causes = (await Symptoma.get(this.symptoms, config.languageCode.slice(0, 2))).slice(0, config.maxCauses).map(({ name }) => name);
        }

        console.log("causes:", this.causes);
    }

    addSymptoms(symptoms) {
        symptoms.forEach(symptom => {
            if (this.symptoms.indexOf(symptom) === -1) {
                this.symptoms.push(symptom);
            }
        });
    }
}