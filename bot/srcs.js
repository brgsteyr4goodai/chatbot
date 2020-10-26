
const Wikipedia = require("./api/wikipedia.js");

const { ICD } = require("./api/icd.js");
const icd_creds = require("./credentials/icd.json");
let icd = new ICD(icd_creds.client_id, icd_creds.client_secret);

module.exports = [ Wikipedia, icd ];