
import CYAnnualGetter = require('./CYAnnualGetter');
import HistoricalTimeOptionsTools = require('../../time options/historicalTimeOptionsTools');
import type { GeneralTimeOptions } from '../../time options/generalTimeOptions.type'

class CYHistoricalAnnualGetter {
    static getHistoricalAnnualValues(conceptResponse, timeOptions: GeneralTimeOptions){
        timeOptions = HistoricalTimeOptionsTools.getTimeOptionsWithAddedDefaultValuesIfUndefined(timeOptions);
        HistoricalTimeOptionsTools.validateTimeOptions(timeOptions);

        const yearsToGet = HistoricalTimeOptionsTools.getAllConsecutiveYearsFromTimeOptions(timeOptions);
        let historicalValues = [];

        for (const year of yearsToGet){
            historicalValues.push(this.tryGetYearAnnualData(conceptResponse, year));
        }
        return historicalValues;
    }

    static tryGetYearAnnualData(conceptResponse, year){
        try{
            return CYAnnualGetter.getYearAnnualData(conceptResponse, year);
        } catch(err){
            return null;
        }
    }
}

export = CYHistoricalAnnualGetter;