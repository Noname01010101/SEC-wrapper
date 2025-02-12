const APIResponseProcessorSuper = require('./super classes/APIResponseProcessorSuper');
const CikCodeCoverter = require('../converters/cikCodeConverter');
const URLConverter = require('../converters/urlConverter');

class APIResponseAnnualProcessor extends APIResponseProcessorSuper {
    static getAnnualOnly(resJSON){
        let annualData = [];
        const resBlocks = this.getAllBlocks(resJSON);
        for (let block of resBlocks){
            if (this.isBlockCoveringFullYear(block)){
                const keyInfo = this.#getKeyInformationFromBlock(block);
                annualData.push(keyInfo);
            }
        }
        APIResponseAnnualProcessor.#validateAnnualData(annualData);
        return annualData;
    }

    static getSpecificYearAnnualReport(resJSON, year){
        const annualProcessed = APIResponseAnnualProcessor.getAnnualOnly(resJSON);
        for (const data of annualProcessed){
            if (data.date == year){
                return data;
            }
        }
        throw new Error('specific year\'s data not found')
    }

    static async getAvailableAnnualYears(symbol){
        const cikCode = await CikCodeCoverter.getSymbolCikCodeWithoutCIKKeyword(symbol);
        const submissionsUrl = URLConverter.getSubmissionsUrl(cikCode);
        const response = await fetch(submissionsUrl);

        const data = await response.json();
        const filings = data.filings.recent;

        let availableYears = [];
        for (let i = 0; i < filings.form.length; i++) {
            if (filings.form[i] === "10-K") {
                const date = filings.filingDate[i];
                const year = date.split("-")[0];
                availableYears.unshift(year);
            }
        }
        return availableYears;
    }

    static #validateAnnualData(annualData){
        if (annualData.length == 0){
            throw new Error("no data is available in the annual data");
        }
        if (this.#doesAnnualDataIncludeMultipleValuesForAYear(annualData)){
            throw new Error("multiple values found for the same year in the data");
        }
        if(!this.#doesAnnualDataIncludeRecentYears(annualData)){
            throw new Error("annual data doesn't include the most recent years");
        }
    }

    static #doesAnnualDataIncludeMultipleValuesForAYear(annualData){
        let years = [];
        for (let data of annualData){
            if (data.date == years){
                return true;
            }
            years.push(data.date);
        }
        return false;
    }

    static #doesAnnualDataIncludeRecentYears(annualData){
        const currentYear = new Date().getFullYear();
        for (let data of annualData){
            if (+data["date"] >= currentYear - 2){
                return true;
            }
        }
        return false;
    }

    static #getKeyInformationFromBlock(block){
        return {date: block['frame'].split("Y")[1], value: +block['val']};
    }
}

module.exports = APIResponseAnnualProcessor;