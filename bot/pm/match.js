class Match {
    
    constructor(patterns) {
        this.patterns = {};
        patterns.slice(0, patterns.length - 1).forEach(({ value, context }) => {
            if (!this.patterns[context]) this.patterns[context] = [];
            this.patterns[context].push(value);
        });
        this.regex = [];
        for (const pattern in this.patterns) {
            let [ begin, end ] = pattern.split("{}");
            if (begin) begin = `${begin.slice(0, begin.length - 1)}\\s`;
            if (end) end = `\\s${end.slice(1)}`;
            this.regex.push(new RegExp(`(?<=${begin})(.*)(?=${end})`, "gi"));
        }
    }

    get(text) {
        let outputs = [];
        this.regex.forEach(regex => {
            let matches = text.match(regex);
            if (matches) outputs = outputs.concat(matches);
        });
        return outputs.map(string => string.replace(/^a\s/, "").toLowerCase());
    }
}

module.exports = Match;