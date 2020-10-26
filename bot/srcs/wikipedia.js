
const config = require("../config.json");

const Wikipedia = require("../api/wikipedia.js");

module.exports = {
    api: Wikipedia,
    Wikipedia: async (name, Wikipedia) => {
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
}