"use strict";
class ConceptResponseGetter {
    static getConceptResponse(generalResponse, concept) {
        const factsKey = this.#getConceptFactsTabName(generalResponse, concept);
        return generalResponse.facts[factsKey][concept];
    }
    static getUsGaapConceptResponse(generalResponse, concept) {
        if (generalResponse.facts['us-gaap'][concept] != undefined) {
            return generalResponse.facts['us-gaap'][concept];
        }
        throw new Error('Could not find the concept in the us:gaap response');
    }
    static #getConceptFactsTabName(generalResponse, concept) {
        for (const key in generalResponse.facts) {
            if (generalResponse.facts[key][concept] != undefined) {
                return key;
            }
        }
        throw new Error(`concept not found in any key of general response. concept: ${concept}`);
    }
}
module.exports = ConceptResponseGetter;
