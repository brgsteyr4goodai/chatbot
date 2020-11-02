module.exports = class {
    static flat (object) {
        let newObject;

        switch (object.kind) {
            case "stringValue":
                newObject = object.stringValue;
                break;

            case "numberValue":
                newObject = object.numberValue;
                break;

            case "boolValue":
                newObject = object.boolValue;
                break;

            case "structValue":
                newObject = {};

                for (let field in object.structValue.fields) {
                    newObject[field] = this.flat(object.structValue.fields[field]);
                }
                break;

            case "listValue":
                newObject = object.listValue.values.map(v => {
                    return this.flat(v);
                })
                break;
            default:
                throw "An error occurred in flattening: unknown kind: "+object.kind;
        }

        return newObject;
    }

    static executionFlat (object) {
        return this.flat(object.diagnosticInfo.fields["Execution Sequence"]);
    }
}