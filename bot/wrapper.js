
const fs = require("fs");
const srcs = fs.readdirSync(`${__dirname}/srcs/`);

class Wrapper {
    static async get(name, api) {
        return await this[api.name || api.constructor.name](name, api);
    }

    /*static async ICD(name, icd) {
        let res = await (await icd.search(name)).first();

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
    }*/

    /*
    static async Wikipedia(name, Wikipedia) {
        let res = await Wikipedia.search(name);
        let id = Wikipedia.getId(res);
        let article = Wikipedia.getPage(await Wikipedia.article(id));
        let extract = Wikipedia.getPage(await Wikipedia.extract(id));

        return {
            id: article.pageid,
            url: [ article.fullurl ],
            src: "Wikipedia",
            name: article.title,
            description: Wikipedia.getFirstParagraph(extract).split(/\.(?!\s)|\n/).slice(0, config.wikipedia.maxParagraphs),
        };
    }
    */
}

srcs.forEach(file => {
    let src = require(`${__dirname}/srcs/${file}`);
    for (const key in src) {
        if (key !== "api") {
            Wrapper[key] = src[key];
        }
    }
})

module.exports = Wrapper;