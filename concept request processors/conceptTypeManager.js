"use strict";
const concepts = require("../concepts/standardConcepts.json");
class ConceptTypeManager {
    static getConceptsFromType(statementType) {
        return concepts[statementType];
    }
}
module.exports = ConceptTypeManager;
