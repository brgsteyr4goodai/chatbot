const fs = require("fs")
const phrases = fs.readFileSync("./phrases2.txt", "utf-8");

phrases.split("\n").forEach(ph => {
    let px = ph.split(":");

    fs.writeFileSync(`./out/${px[0]}.txt`, px[1].split(", ").join("\n"));
})