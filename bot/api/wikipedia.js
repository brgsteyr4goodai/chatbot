
const https = require("https");
const querystring = require("querystring");

class Wikipedia {

    static lang = "en";
    
    static options = {
        port: 443,
        path: "/",
        method: "GET",
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    static queryobj = {
        "action": "query",
        "format": "json"
    };

    static lang(lang) {
        this.lang = lang;
    }

    static query(obj) {
        return new Promise((resolve, reject) => {
            const hostname = `${this.lang}.wikipedia.org`;
            const qstring = querystring.stringify({ ...this.queryobj, ...obj });
            const path = `/w/api.php?${qstring}`;
            const options = { ...this.options, hostname, path };

            let req = https.request(options, res => {
                let data = "";

                res.on("data", chunck => {
                    data += chunck;
                });

                res.on("end", () => {
                    data = JSON.parse(data);
                    resolve(data);
                });
            });
            
            req.on("error", error => {
                console.error(error);
                reject(error);
            });
            
            req.end();
        });
    }

    static async article(id) {
        return await this.query({
            "prop": "info",
            "pageids": id,
            "inprop": "url",
        });
    }

    static async extract(id) {
        return await this.query({
            "prop": "extracts",
            "explaintext": "1",
            "pageids": id,
        });
    }

    static async search(term) {
        return await this.query({
            "list": "search",
            "srsearch": term,
        });
    }

    static getId(res) {
        return res.query.search[0].pageid;
    }

    static getPage(res) {
        let pages = res.query.pages;
        for (let id in pages) {
            return pages[id];
        }
    }

    static getFirstParagraph(extract) {
        return extract.extract.split("\n\n\n")[0];
    }
}

module.exports = Wikipedia;