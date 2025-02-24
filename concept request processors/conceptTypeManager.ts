import concepts = require('../concepts/standardConcepts.json');
type StatementType = keyof typeof concepts

class ConceptTypeManager {
    static getConceptsFromType(statementType: StatementType){
        return concepts[statementType];
    }
}

export = ConceptTypeManager;