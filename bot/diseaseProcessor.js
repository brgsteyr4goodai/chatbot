
const fs = require("fs");
const Match = require("./pm/match.js");
const Symptoma = require("./api/symptoma.js");
const Wrapper = require("./wrapper.js");
const config = require("./config.json");
const symptoms = require("./pm/symptoms.json");
const match = new Match(symptoms);

srcs = fs.readdirSync(`${__dirname}/srcs/`).map(file => file.slice(0, -3));

module.exports = class {
    constructor(bot) {
        this.bot = bot;
        this.symptoms = [];
        this.causes = [];
    }

    async message (msg, response) {
        let pmSymptoms = match.get(msg);

        let dfSymptoms = [];
        if (response !== undefined) {
            if (response.listValue.values.length > 0) {
                dfSymptoms = response.listValue.values.map(v => v.stringValue);
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
        this.causes = (await Symptoma.get(this.symptoms, config.df.languageCode.slice(0, 2))).slice(0, config.maxCauses);
    }

    //------------------------ output

    async getInfoByNumber (index) {
        if (index < 1 || index > this.causes.length + 1) {
            this.bot.output.addOutput(`Invalid index: ${index}`);
            return;
        }

        let illness = this.causes[index-1].name;

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
        this.bot.output.addDebug("Symptoms:", this.symptoms);
        this.bot.output.addOutput("Possible causes: "+this.causes.map(({ name }) => name).join(", "));
    }
}