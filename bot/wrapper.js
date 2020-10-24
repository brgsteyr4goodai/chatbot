
class Wrapper {
    static async get(name, api) {
        return await this[api.name || api.constructor.name](name, api);
    }

    static async ICD(name, icd) {
        let res = await (await icd.search(name)).first();

        return {
            id: res.getId(),
            url: res.constructor.toUrl(res.getId()),
            name: res.getTitle(),
            description: res.getDefinition(),
            synonyms: res.getSynonyms()
        };
    }

    static async Wikipedia(name, Wikipedia) {
        let res = await Wikipedia.search(name);
        let id = Wikipedia.getId(res);
        let article = Wikipedia.getPage(await Wikipedia.article(id));
        let extract = Wikipedia.getPage(await Wikipedia.extract(id));

        return {
            id: article.pageid,
            url: article.fullurl,
            name: article.title,
            description: Wikipedia.getFirstParagraph(extract),
        };
    }
}

module.exports = Wrapper;