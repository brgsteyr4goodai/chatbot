const Match = require("./pm/match.js");
const Symptoma = require("./api/symptoma.js");
const { ICD, ICDRes } = require("./api/icd.js");
const Wikipedia = require("./api/wikipedia.js");
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

    async getInfo(output, response) {
        if (response.queryResult.parameters.fields.number === undefined) return;
        let index = response.queryResult.parameters.fields.number.listValue.values[0].numberValue;
        let name = this.causes[index-1].name;

        let icdRes = await (await icd.search(name)).first();
        output.addDebug("\nICD", {
            id: icdRes.getId(),
            url: ICDRes.toUrl(icdRes.getId()),
            name: icdRes.getTitle(),
            description: icdRes.getDefinition(),
            synonyms: icdRes.getSynonyms()
        });

        let wikipediaRes = await Wikipedia.search(name);
        let id = Wikipedia.getId(wikipediaRes);
        let article = Wikipedia.getPage(await Wikipedia.article(id));
        let extract = Wikipedia.getPage(await Wikipedia.extract(id));
        output.addDebug("\nWikipedia", {
            id: article.pageid,
            url: article.fullurl,
            name: article.title,
            description: Wikipedia.getFirstParagraph(extract),
        });
        output.addOutput(name);
    }

    logSymptomsAndCauses (output) {
        output.addOutput("Running a diagnose...");
        output.addDebug("Symptoms:", this.symptoms);
        output.addOutput("Possible causes: "+this.causes.map(({ name }) => name).join(", "));
    }
}