
const https = require("https");
const querystring = require("querystring");

class Symptoma {

    static options = {
        hostname: "www.symptoma.com",
        port: 443,
        path: "/",
        method: "GET",
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    
    static get(symptoms, lang = "en") {
        return new Promise((resolve, reject) => {
            const hostname = `www.symptoma.${lang !== "en" ? "at" : "com"}`;
            const path = `/${lang}/spa/search/causes?${querystring.stringify({ query: symptoms })}`;
            let req = https.request({ ...this.options, hostname, path }, res => {
                let data = "";

                res.on("data", chunck => {
                    data += chunck;
                });

                res.on("end", () => {
                    data = JSON.parse(data);
                    data = data.causes.map((cause) => {
                        return {
                            name: cause.title,
                            slug: cause.slug,
                            id: cause.conceptId,
                            info: `https://www.symptoma.at/de/info/${cause.slug}#info`,
                            test: `https://www.symptoma.at/de/info/${cause.slug}#test`,
                            srcs: cause.snippetParts.map(({ reference }) => reference.link.url)
                        };
                    });
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
}

module.exports = Symptoma;