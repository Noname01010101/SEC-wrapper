"use strict";
const CYQuarterGetter = require("./CYQuarterGetter");
const HistoricalTimeOptionsTools = require("../../time options/historicalTimeOptionsTools");
class CYHistoricalQuarterGetter {
    static getHistoricalQuarterValues(conceptResponse, timeOptions) {
        timeOptions = HistoricalTimeOptionsTools.getTimeOptionsWithAddedDefaultValuesIfUndefined(timeOptions);
        HistoricalTimeOptionsTools.validateTimeOptions(timeOptions);
        const yearsToGet = HistoricalTimeOptionsTools.getAllConsecutiveYearsFromTimeOptions(timeOptions);
        let historicalValues = [];
        for (const year of yearsToGet) {
            historicalValues = historicalValues.concat(this.getAllQuartersFromYear(conceptResponse, year));
        }
        return historicalValues;
    }
    static getAllQuartersFromYear(conceptResponse, year) {
        let quartersData = [];
        quartersData.push(CYQuarterGetter.getSpecificQuarterData(conceptResponse, year, 1));
        quartersData.push(CYQuarterGetter.getSpecificQuarterData(conceptResponse, year, 2));
        quartersData.push(CYQuarterGetter.getSpecificQuarterData(conceptResponse, year, 3));
        quartersData.push(CYQuarterGetter.getSpecificQuarterData(conceptResponse, year, 4));
        return quartersData;
    }
}
module.exports = CYHistoricalQuarterGetter;
