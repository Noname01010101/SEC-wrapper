"use strict";
const ConceptResponseGetter = require("../concept response processors/raw response processors/conceptResponseGetter");
const CYQuarterGetter = require("../concept response processors/calendar year/quarter processors/CYQuarterGetter");
const TimeOptionsTools = require("../concept response processors/time options/historicalTimeOptionsTools");
const nestedObjectsTools = require("../json tools/nestedObjectsTools");
class QuarterStatementMaker {
    static getHistoricalQuarterStatements(companyFactsResponse, concepts, timeOptions) {
        timeOptions = TimeOptionsTools.getTimeOptionsWithAddedDefaultValuesIfUndefined(timeOptions);
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let historicalQuarters = [];
        const yearsToGet = TimeOptionsTools.getAllConsecutiveYearsFromTimeOptions(timeOptions);
        let errorMessage = "";
        for (const year of yearsToGet) {
            try {
                historicalQuarters = historicalQuarters.concat(this.getAllAvailableQuartersFromYear(companyFactsResponse, concepts, year));
            }
            catch (err) {
                errorMessage = err.message;
                break;
            }
        }
        this.#validateHistoricalQuarterData(historicalQuarters, errorMessage);
        return historicalQuarters;
    }
    static #validateHistoricalQuarterData(data, errorMessage) {
        if (data.length == 0) {
            throw new Error(`no historical statement found - empty data -> error: ${errorMessage}`);
        }
    }
    static getLatestQuarterStatement(companyFactsResponse, concepts) {
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        const now = new Date();
        const oneYearAgoDate = new Date();
        oneYearAgoDate.setFullYear(now.getFullYear() - 1);
        const oneYearAgo = oneYearAgoDate.getFullYear().toString();
        const recentHistoricalStatements = this.getHistoricalQuarterStatements(companyFactsResponse, concepts, { startYear: oneYearAgo });
        return recentHistoricalStatements[recentHistoricalStatements.length - 1];
    }
    static getAllAvailableQuartersFromYear(companyFactsResponse, concepts, year) {
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let quarterStatements = [];
        for (let i = 1; i < 5; i++) {
            try {
                quarterStatements.push(this.getQuarterStatement(companyFactsResponse, concepts, year, i));
            }
            catch (err) {
                return quarterStatements;
            }
        }
        return quarterStatements;
    }
    static getQuarterStatement(companyFactsResponse, concepts, year, quarter) {
        concepts = nestedObjectsTools.getObjectWithoutSections(concepts);
        let quarterStatement = {};
        for (const key in concepts) {
            const conceptResponse = ConceptResponseGetter.getUsGaapConceptResponse(companyFactsResponse, concepts[key]);
            const annualValue = CYQuarterGetter.getSpecificQuarterData(conceptResponse, year, quarter);
            quarterStatement[key] = annualValue.value;
        }
        return quarterStatement;
    }
}
module.exports = QuarterStatementMaker;
