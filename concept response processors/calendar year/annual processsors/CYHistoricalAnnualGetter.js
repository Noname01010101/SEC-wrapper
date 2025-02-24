"use strict";
const CYAnnualGetter = require("./CYAnnualGetter");
const HistoricalTimeOptionsTools = require("../../time options/historicalTimeOptionsTools");
class CYHistoricalAnnualGetter {
    static getHistoricalAnnualValues(conceptResponse, timeOptions) {
        timeOptions = HistoricalTimeOptionsTools.getTimeOptionsWithAddedDefaultValuesIfUndefined(timeOptions);
        HistoricalTimeOptionsTools.validateTimeOptions(timeOptions);
        const yearsToGet = HistoricalTimeOptionsTools.getAllConsecutiveYearsFromTimeOptions(timeOptions);
        let historicalValues = [];
        for (const year of yearsToGet) {
            historicalValues.push(this.tryGetYearAnnualData(conceptResponse, year));
        }
        return historicalValues;
    }
    static tryGetYearAnnualData(conceptResponse, year) {
        try {
            return CYAnnualGetter.getYearAnnualData(conceptResponse, year);
        }
        catch (err) {
            return null;
        }
    }
}
module.exports = CYHistoricalAnnualGetter;
