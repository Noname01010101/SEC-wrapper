import { GeneralTimeOptions } from "../concept response processors/time options/generalTimeOptions.type";
import ConceptResponseGetter = require("../concept response processors/raw response processors/conceptResponseGetter");
import CYQuarterGetter = require("../concept response processors/calendar year/quarter processors/CYQuarterGetter");
import TimeOptionsTools = require("../concept response processors/time options/historicalTimeOptionsTools");
import nestedObjectsTools = require('../json tools/nestedObjectsTools')

class QuarterStatementMaker{
    static getHistoricalQuarterStatements(companyFactsResponse, concepts, timeOptions: GeneralTimeOptions){
        timeOptions = TimeOptionsTools.getTimeOptionsWithAddedDefaultValuesIfUndefined(timeOptions);
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let historicalQuarters = [];
        const yearsToGet = TimeOptionsTools.getAllConsecutiveYearsFromTimeOptions(timeOptions);

        let errorMessage = "";
        for (const year of yearsToGet){
            try{
                historicalQuarters = historicalQuarters.concat(this.getAllAvailableQuartersFromYear(companyFactsResponse, concepts, year));
            } catch (err){
                errorMessage = err.message;
                break;
            }
        }
        this.#validateHistoricalQuarterData(historicalQuarters, errorMessage);
        return historicalQuarters;
    }

    static #validateHistoricalQuarterData(data, errorMessage){
        if (data.length == 0){
            throw new Error(`no historical statement found - empty data -> error: ${errorMessage}`);
        }
    }

    static getLatestQuarterStatement(companyFactsResponse, concepts){
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        const now = new Date();
        const oneYearAgoDate = new Date();
        oneYearAgoDate.setFullYear(now.getFullYear() - 1);
        const oneYearAgo = oneYearAgoDate.getFullYear().toString();
        const recentHistoricalStatements = this.getHistoricalQuarterStatements(companyFactsResponse, concepts, {startYear: oneYearAgo});
        return recentHistoricalStatements[recentHistoricalStatements.length - 1];
    }

    static getAllAvailableQuartersFromYear(companyFactsResponse, concepts, year){
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let quarterStatements = [];
        for (let i = 1; i < 5; i++){
            try{
                quarterStatements.push(this.getQuarterStatement(companyFactsResponse, concepts, year, i));
            } catch (err){
                return quarterStatements;
            }
        }
        return quarterStatements;
    }

    static getQuarterStatement(companyFactsResponse, concepts, year, quarter){
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let quarterStatement = {};
        for (const key in concepts){
            for (let i = 0; i < concepts[key].length; i++){
                try{
                    const conceptResponse = ConceptResponseGetter.getConceptResponse(companyFactsResponse, concepts[key][i]);
                    const annualValue = CYQuarterGetter.getSpecificQuarterData(conceptResponse, year, quarter);
                    quarterStatement[key] = annualValue.value;
                    break;
                } catch(err){
                    if(i != concepts[key].length - 1){
                        continue;
                    }
                }
                throw new Error(`could not find concept. key: ${key}`);
            }
        }
        return quarterStatement;
    }
}

export = QuarterStatementMaker