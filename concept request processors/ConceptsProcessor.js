"use strict";
const JsonNestedTool = require("../json tools/nestedObjectsTools");
const ConceptTypeManager = require("./conceptTypeManager");
class ConceptsProcessor extends ConceptTypeManager {
    static getPlainConcepts(conceptType) {
        const conceptsTarget = super.getConceptsFromType(conceptType);
        const unsectionalizedConcepts = JsonNestedTool.getObjectWithoutSections(conceptsTarget);
        return unsectionalizedConcepts;
    }
}
module.exports = ConceptsProcessor;
