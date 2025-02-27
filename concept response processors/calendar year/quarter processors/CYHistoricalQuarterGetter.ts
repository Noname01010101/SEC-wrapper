
import CYQuarterGetter = require('./CYQuarterGetter');
import HistoricalTimeOptionsTools = require('../../time options/historicalTimeOptionsTools');
import type { GeneralTimeOptions } from '../../time options/generalTimeOptions.type'

class CYHistoricalQuarterGetter {
    static getHistoricalQuarterValues(conceptResponse, timeOptions: GeneralTimeOptions){
        timeOptions = HistoricalTimeOptionsTools.getTimeOptionsWithAddedDefaultValuesIfUndefined(timeOptions);
        HistoricalTimeOptionsTools.validateTimeOptions(timeOptions);

        const yearsToGet = HistoricalTimeOptionsTools.getAllConsecutiveYearsFromTimeOptions(timeOptions);
        let historicalValues = [];
        for (const year of yearsToGet){
            try{
                historicalValues = historicalValues.concat(this.getAllQuartersFromYear(conceptResponse, year));
            } catch(err){
                break;
            }

        }

        this.#validateHistoricalValues(historicalValues);
        return historicalValues;
    }

    static getAllQuartersFromYear(conceptResponse,year){
        let quartersData = [];
        for (let i = 1; i < 5; i++){
            try{
                quartersData.push(CYQuarterGetter.getSpecificQuarterData(conceptResponse, year, i));
            } catch(err){
                break;
            }
        }

        this.#validateQuarterData(quartersData);
        return quartersData;
    }

    static #validateHistoricalValues(historicalValues){
        if (historicalValues.length == 0){
            throw new Error('No historical values for time period found');
        }
    }

    static #validateQuarterData(quartersData){
        if (quartersData.length == 0){
            throw new Error('no quarter data in the array')
        }

        let previousQuarterNumber = 0;
        for (const value of quartersData){
            if(+value.quarter != previousQuarterNumber + 1){
                throw new Error('multiple quarters or out of sequence data error');
            }
            previousQuarterNumber++;
        }
    }
}

export = CYHistoricalQuarterGetter