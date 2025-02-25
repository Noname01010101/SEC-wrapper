import CYAnnualGetter = require("../concept response processors/calendar year/annual processsors/CYAnnualGetter");
import { GeneralTimeOptions } from "../concept response processors/time options/generalTimeOptions.type";
import ConceptResponseGetter = require("../concept response processors/raw response processors/conceptResponseGetter");
import TimeOptionsTools = require('../concept response processors/time options/historicalTimeOptionsTools')
import nestedObjectsTools = require('../json tools/nestedObjectsTools');


class AnnualStatementMaker {
    static getHistoricalAnnualStatement(companyFactsResponse, concepts, timeOptions: GeneralTimeOptions){
        timeOptions = TimeOptionsTools.getTimeOptionsWithAddedDefaultValuesIfUndefined(timeOptions);
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let historicalAnnual = [];
        const yearsToGet = TimeOptionsTools.getAllConsecutiveYearsFromTimeOptions(timeOptions);
        for (const year of yearsToGet){
            try{
                const annualStatement = this.getAnnualStatement(companyFactsResponse, concepts, year);
                historicalAnnual.push(annualStatement);
            } catch(err){
                break;
            }
        }
        this.#validateAnnualData(historicalAnnual);
        return historicalAnnual;
    }

    static #validateAnnualData(data){
        if (data.length == 0){
            throw new Error('no historical statement found - array length is 0');
        }
    }

    static getAnnualStatement(companyFactsResponse, concepts, year: string){
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let annualStatement = {};
        for (const key in concepts){
            const conceptResponse = ConceptResponseGetter.getUsGaapConceptResponse(companyFactsResponse, concepts[key]);
            const annualValue = CYAnnualGetter.getYearAnnualData(conceptResponse, year).value;
            annualStatement[key] = annualValue;
        }
        return annualStatement;
    }
}

export = AnnualStatementMaker;