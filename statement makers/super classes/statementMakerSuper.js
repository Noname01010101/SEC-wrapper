const CikCodeCoverter = require('../../converters/cikCodeConverter');
const URLConverter = require('../../converters/urlConverter');
const APIResponseAnnualProcessor = require('../../processors/APIResponseAnnualProcessor');
const APIResponseQuarterProcessor = require('../../processors/APIResponseQuarterProcessor');
const APIRateLimitedFetch = require('../../SEC requirements/rateLimit').APIRateLimitedFetch;

class StatementMakerSuper {
constructor(){
        this.symbol = "";
        this.cikCode = -1;
        this.statement = {};
    }

    async #setupSymbol(symbol){
        this.symbol = symbol;
        this.cikCode = await CikCodeCoverter.getSymbolCikCodeWithoutCIKKeyword(symbol);
    }
    async getTTMStatement(symbol, statementConcepts){
        return await this.getStatement(symbol, statementConcepts, this.#fillStatementWithTTMValues.bind(this));
    }

    async getLatestQuarterStatements(symbol, statementConcepts){
        return await this.getStatement(symbol, statementConcepts, this.#fillStatementLatestQuarters.bind(this));
    }

    async getLatestAnnualStatement(symbol, statementConcepts){
        return await this.getStatement(symbol, statementConcepts, this.#fillStatementWithLatestYear.bind(this));
    }

    async getSpecificYearAnnualStatement(symbol, statementConcepts, year){
        return await this.getStatement(symbol, statementConcepts, this.#fillStatementWithSpecificYear.bind(this), year);
    }

    async getHistoricalAnnualStatements(symbol, statementConcepts){
        return await this.getStatement(symbol, statementConcepts, this.#fillStatementWithHistoricalAnnual.bind(this), symbol);
    }

    async getStatement(symbol, statementConcepts, fillFunction, additionalArg){
        await this.#setupSymbol(symbol);

        const res = await this.#fetchGeneralURL();
        this.#validateResponse(res);
        const resJSON = await this.#getResponseInJson(res);

        if (additionalArg != undefined){
            await fillFunction(resJSON, statementConcepts, additionalArg);
        } else {
            await fillFunction(resJSON, statementConcepts);
        }
        return this.statement;
    }

    #fillStatementWithSpecificYear(res, conceptsWithSections, year){
        this.statement = this.#getOrganizedValuesAnnual(res, conceptsWithSections, year);
    } 
    async #fillStatementWithLatestYear(res, conceptsWithSections){
        const latestAnnualReportYear = await this.#getLatestAnnualReportYear();
        this.#fillStatementWithSpecificYear(res, conceptsWithSections, latestAnnualReportYear);

    } 
    async #fillStatementWithHistoricalAnnual(res, conceptsWithSections, symbol){
        const availableYears = await APIResponseAnnualProcessor.getAvailableAnnualYears(symbol);
        this.statement = {};
        for (const year of availableYears){
            this.statement[`${year}`] = this.#getOrganizedValuesAnnual(res, conceptsWithSections, year);
        }
    }

    #fillStatementLatestQuarters(res, conceptsWithSections){
        this.statement = {};
        for (let i = 0; i < 4; i++){
            this.statement[`Q${i + 1}`] = this.#getOrganizedValuesForQuarter(res, conceptsWithSections, i);
        }
    }

    #fillStatementWithTTMValues(res, conceptsWithSections){
        this.statement = this.#getOrganizedValuesTTM(res, conceptsWithSections);
    }
    
    #getOrganizedValuesAnnual(res, concepts, year){
        let result = {};
        for(const key in concepts){
            if (typeof concepts[key] === "object"){
                result[key] = this.#getOrganizedValuesAnnual(res, concepts, year);
            } else {
                const conceptInResponse = this.#getUsGaapConceptInGeneralResponse(concepts[key], res);
                result[key] = this.#tryToGetResponseValueForSpecificYear(conceptInResponse, year);
            }
        }
        return result;
    }

    #getOrganizedValuesForQuarter(res, concepts, quarterIndex){
        let result = {};
        for(const key in concepts){
            if (typeof concepts[key] === "object"){
                result[key] = this.#getOrganizedValuesForQuarter(res, concepts, quarterIndex);
            } else {
                const conceptInResponse = this.#getUsGaapConceptInGeneralResponse(concepts[key], res);
                result[key] = this.#tryGetQuarterValue(conceptInResponse, quarterIndex);
            }
        }
        return result;
    }

    #getOrganizedValuesTTM(res, concepts){
        let result = {};
        for(const key in concepts){
            if (typeof concepts[key] === "object"){
                result[key] = this.#getOrganizedValuesTTM(res, concepts);
            } else {
                const conceptInResponse = this.#getUsGaapConceptInGeneralResponse(concepts[key], res);
                result[key] = this.#tryGetTTMValue(conceptInResponse);
            }
        }
        return result;
    }

    #tryToGetResponseValueForSpecificYear(resJSON, year){
        try{
            const yearData = APIResponseAnnualProcessor.getSpecificYearAnnualReport(resJSON, year);
            return yearData.value;
        } catch (err){
            return this.#getDefaultReturnValue();
        }
    }

    #tryGetQuarterValue(resJSON, quarterIndex){
        try{
            const quarterData = APIResponseQuarterProcessor.getLatestQuarterValues(resJSON);
            return quarterData[quarterIndex];
        } catch (err){
            return this.#getDefaultReturnValue();
        }
    }

    #tryGetTTMValue(resJSON){
        try{
            const quarterData = APIResponseQuarterProcessor.getLatestQuarterValues(resJSON);
            let sum = quarterData.reduce((acc, value) => acc + value, 0);
            return sum;
        } catch (err){
            return this.#getDefaultReturnValue();
        }
    }

    #getDefaultReturnValue(){
        return null;
    }

    #validateResponse(res){
        if (!this.#isResponseOk(res)){
            throw new Error('could not fetch correctly because the response was not ok');
        }
    }
    #isResponseOk(res){
        return res.ok;
    }
    async #getResponseInJson(res){
        return await res.json();
    }
    async #fetchGeneralURL(){
        const keyURL = URLConverter.getCompanyFactsUrl(this.cikCode);
        const res = await APIRateLimitedFetch(keyURL);
        return res;
    }

    #getUsGaapConceptInGeneralResponse(concept, res){
        return res.facts['us-gaap'][concept];
    }

    async #getLatestAnnualReportYear(){
        const cikCode = await CikCodeCoverter.getSymbolCikCodeWithoutCIKKeyword(this.symbol);
        const submissionsUrl = URLConverter.getSubmissionsUrl(cikCode);
            const response = await fetch(submissionsUrl);
    
            const data = await this.#getResponseInJson(response);
            const filings = data.filings.recent;
    
            // Find the most recent 10-K filing
            for (let i = 0; i < filings.form.length; i++) {
                if (filings.form[i] === "10-K") {
                    const latest10KDate = filings.filingDate[i]; // Format: YYYY-MM-DD
                    const latest10KYear = latest10KDate.split("-")[0]; // Extract year
                    return latest10KYear;
                }
            }
            throw new Error('could not get the the latest 10k report date');
    }
}

module.exports = StatementMakerSuper;