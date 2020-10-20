let json = require("./dlInt/symptom2_add.json");
const symptomD = require("./df_createPhrase");

json.userSays = [];

symptomD.forEach(syDF => {
    json.userSays.push({
        isTemplate: false,
        data: [
            {
                text: syDF,
                userDefined: false
            }
        ]
    })
})

require("fs").writeFileSync("./dlInt/symptom2_add-np.json", JSON.stringify(json, null, 2))
