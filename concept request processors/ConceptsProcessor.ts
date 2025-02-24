import concepts = require('../concepts/standardConcepts.json');
import JsonNestedTool = require('../json tools/nestedObjectsTools');

import ConceptTypeManager = require('./conceptTypeManager');

class ConceptsProcessor extends ConceptTypeManager{
    static getPlainConcepts(conceptType){
        const conceptsTarget = super.getConceptsFromType(conceptType);
        const unsectionalizedConcepts = JsonNestedTool.getObjectWithoutSections(conceptsTarget);
        return unsectionalizedConcepts;
    }
}

export = ConceptsProcessor;