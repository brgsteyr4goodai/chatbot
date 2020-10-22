
const https = require("https");

class ICD {

    constructor(client_id, client_secret) {
        return new Promise((resolve, reject) => {
            this.client_id = client_id;
            this.client_secret = client_secret;
            this.getToken().then(token => {
                this.token = token;
                resolve(this);
            });
        });
    }

    async getToken() {
        const scope = "icdapi_access";
        const grant_type = "client_credentials";

        return new Promise((resolve, reject) => {
            const Authorization = `Basic ${new Buffer.from(`${this.client_id}:${this.client_secret}`).toString("base64").toString("utf-8")}`;
            let options = {
                hostname: "icdaccessmanagement.who.int",
                port: 443,
                path: "/connect/token",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization
                }
            };
    
            let req = https.request(options, res => {
                let data = "";

                res.on("data", chunck => {
                    data += chunck;
                });

                res.on("end", () => {
                    resolve(JSON.parse(data.toString()).access_token);
                });
            });
    
            req.on("error", error => {
                console.error(error);
                reject();
            });
    
            req.write(`grant_type=${grant_type}&scope=${scope}`, "utf-8");
            req.end();
        });
    }

    async search(term) {
        return await this.get(`search?q=${term}`);
    }

    async get(path) {
        return new Promise((resolve, reject) => {
            let options = {
                hostname: "id.who.int",
                port: 443,
                path: `/icd/entity/${path}`,
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                    "Accept": "application/json",
                    "Accept-Language": "en",
                    "API-Version": "v2"
                }
            };
    
            let req = https.request(options, res => {
                let data = "";
    
                res.on("data", chunck => {
                    data += chunck;
                });
    
                res.on("end", () => {
                    try {
                        resolve(new ICDRes(JSON.parse(data.toString()), this));
                    }
                    catch (error) {
                        console.error(error);
                    }
                });
            });
    
            req.on("error", error => {
                console.error(error);
                reject();
            });
    
            req.end();
        });
    }
}

class ICDRes {
    
    constructor(object, icd) {
        Object.assign(this, object);
        this.icd = icd;
    }

    getId() {
        let id = this["@id"] || this.id;
        return ICDRes.toId(id);
    }

    getTitle() {
        if (typeof this.title === "string") {
            return this.title;
        }
        return this.title["@value"];
    }

    getDefinition() {
        return this.definition["@value"];
    }

    getSynonyms() {
        return this.synonym.map(({ label }) => label["@value"]);
    }

    async first() {
        let [ first ] = await this.getResult(0, 1);
        return first;
    }

    async getResult(start, end) {
        let ids = this.destinationEntities.map(res => new ICDRes(res, this.icd).getId());
        return await ICDRes.getIdList(ids, this.icd, start, end);
    }

    async getParents(start, end) {
        let ids = this.parent.map(parent => ICDRes.toId(parent));
        return await ICDRes.getIdList(ids, this.icd, start, end);
    }

    async getChildren(start, end) {
        let ids = this.child.map(child => ICDRes.toId(child));
        return await ICDRes.getIdList(ids, this.icd, start, end);
    }

    static toUrl(id, path = "/icd/entity/") {
        return `https://id.who.int${path}${id}`;
    }

    static toId(url) {
        return url.match(/\d+/)[0];
    }

    static async getIdList(list, icd, start, end) {
        return await Promise.all(list.slice(start, end).map(async id => {
            return await icd.get(id);
        }));
    }
}

module.exports = { ICD, ICDRes };