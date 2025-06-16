"use strict";
const CYAnnualGetter = require("../concept response processors/calendar year/annual processsors/CYAnnualGetter");
const ConceptResponseGetter = require("../concept response processors/raw response processors/conceptResponseGetter");
const TimeOptionsTools = require("../concept response processors/time options/historicalTimeOptionsTools");
const nestedObjectsTools = require("../json tools/nestedObjectsTools");
class AnnualStatementMaker {
    static getHistoricalAnnualStatement(companyFactsResponse, concepts, timeOptions) {
        timeOptions = TimeOptionsTools.getTimeOptionsWithAddedDefaultValuesIfUndefined(timeOptions);
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let historicalAnnual = [];
        const yearsToGet = TimeOptionsTools.getAllConsecutiveYearsFromTimeOptions(timeOptions);
        for (const year of yearsToGet) {
            try {
                const annualStatement = this.getAnnualStatement(companyFactsResponse, concepts, year);
                historicalAnnual.push(annualStatement);
            }
            catch (err) {
                break;
            }
        }
        this.#validateAnnualData(historicalAnnual);
        return historicalAnnual;
    }
    static #validateAnnualData(data) {
        if (data.length == 0) {
            throw new Error('no historical statement found - array length is 0');
        }
    }
    static getAnnualStatement(companyFactsResponse, concepts, year) {
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let annualStatement = {};
        for (const key in concepts) {
            for (let i = 0; i < concepts[key].length; i++) {
                try {
                    const conceptResponse = ConceptResponseGetter.getConceptResponse(companyFactsResponse, concepts[key][i]);
                    const annualValue = CYAnnualGetter.getYearAnnualData(conceptResponse, year).value;
                    annualStatement[key] = annualValue;
                    break;
                }
                catch (err) {
                    if (i != concepts[key].length - 1) {
                        continue;
                    }
                }
                throw new Error(`could not find concept. key: ${key}`);
            }
        }
        return annualStatement;
    }
}
module.exports = AnnualStatementMaker;
