
const { ICD } = require("../api/icd.js");
const icd_creds = require("../credentials/icd.json");
let icd = new ICD(icd_creds.client_id, icd_creds.client_secret);

module.exports = async name => {
    let res = await (await (await icd).search(name)).first();

    if (!res) {
        return;
    }

    let id = res.getId();

    return {
        id,
        url: [
            `https://icd.who.int/browse11/l-m/en#/http%3A%2F%2Fid.who.int%2Ficd%2Fentity%2F${id}`,
            `https://icd.who.int/dev11/f/en#/http%3A%2F%2Fid.who.int%2Ficd%2Fentity%2F${id}`
        ],
        src: "ICD",
        name: res.getTitle(),
        description: res.getDefinition(),
        synonyms: res.getSynonyms()
    };
};