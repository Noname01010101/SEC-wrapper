import CYHistoricalQuarterGetter = require("../concept response processors/calendar year/quarter processors/CYHistoricalQuarterGetter");
import ConceptResponseGetter = require("../concept response processors/raw response processors/conceptResponseGetter");
import nestedObjectsTools = require('../json tools/nestedObjectsTools')

class TTMStatementMaker {
    static getTTMStatement(companyFactsResponse, concepts){
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let ttm = {};
        for(const key in concepts){
            for (let i = 0; i < concepts[key].length; i++){
                try{
                    let sum = this.#getSummedTTMConceptValues(companyFactsResponse, concepts[key][i]);
                    ttm[key] = sum;
                    break;
                } catch (err){
                    if(i != concepts[key].length - 1){
                        continue;
                    }
                }
                throw new Error(`could not find concept. key: ${key}`);
            }
        }
        return ttm;
    }

    static #getSummedTTMConceptValues(companyFactsResponse, concept) : number{
        const conceptResponse = ConceptResponseGetter.getConceptResponse(companyFactsResponse, concept);
        const latestQuarterValues = this.#getLatestQuarterValues(conceptResponse);
        let sum = 0;
        latestQuarterValues.forEach((element) => {sum += element});
        return sum;
    }

    static #getLatestQuarterValues(conceptResponse) : Array<number>{
        const now = new Date();
        const oneYearAgoDate = new Date();
        oneYearAgoDate.setFullYear(now.getFullYear() - 1);
        const oneYearAgo = oneYearAgoDate.getFullYear().toString();

        const retrievedQuarters = CYHistoricalQuarterGetter.getHistoricalQuarterValues(conceptResponse, {startYear: oneYearAgo});
        let latestQuarterValues = [];
        for (let i = retrievedQuarters.length - 1; i > retrievedQuarters.length - 5; i--){
            latestQuarterValues.push(retrievedQuarters[i].value);
        }
        return latestQuarterValues;
    }
}

export = TTMStatementMaker