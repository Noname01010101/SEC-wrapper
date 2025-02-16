"use strict";
const CikCodeCoverter = require("../converters/cikCodeConverter");
const URLConverter = require("../converters/urlConverter");
const APIResponseAnnualProcessor = require("../processors/APIResponseAnnualProcessor");
const APIResponseQuarterProcessor = require("../processors/APIResponseQuarterProcessor");
const rateLimit = require("../SEC requirements/rateLimit");
const APIRateLimitedFetch = rateLimit.APIRateLimitedFetch;
const StandardConcepts = require("../concepts/standardConcepts.json");
const NestedObjectsTools = require("../json tools/nestedObjectsTools");
class StatementMaker {
    symbol;
    cikCode;
    statement;
    reportingPeriodFillFunctions;
    constructor() {
        this.reportingPeriodFillFunctions = {
            "latestQuarters": (fillOptions) => this.#fillStatementLatestQuarters(fillOptions),
            "historicalAnnual": (fillOptions) => this.#fillStatementWithHistoricalAnnual(fillOptions),
            "latestAnnual": (fillOptions) => this.#fillStatementWithLatestYear(fillOptions),
            "specificYear": (fillOptions) => this.#fillStatementWithSpecificYear(fillOptions),
            "ttm": (fillOptions) => this.#fillStatementWithTTMValues(fillOptions),
            "latestQuarter": (fillOptions) => this.#fillStatementWithLatestQuarter(fillOptions)
        };
    }
    async #setupSymbol(symbol) {
        this.symbol = symbol;
        this.cikCode = await CikCodeCoverter.getSymbolCikCodeWithoutCIKKeyword(symbol);
    }
    async getStatement(symbol, options) {
        await this.#setupSymbol(symbol);
        const res = await this.#fetchGeneralURL();
        this.#validateResponse(res);
        const resJSON = await this.#getResponseInJson(res);
        const fillOptions = {
            year: options['year'],
            SECResponse: resJSON,
            concepts: StandardConcepts[options.financialStatement]
        };
        await this.reportingPeriodFillFunctions[options.reportingPeriod](fillOptions);
        return this.statement;
    }
    #fillStatementWithSpecificYear(fillOptions) {
        this.statement = [this.#getOrganizedValuesFromResponse(fillOptions.SECResponse, fillOptions.concepts, { valueType: "specificYear", year: fillOptions.year })];
        this.statement[0]['year'] = fillOptions.year;
    }
    async #fillStatementWithLatestYear(fillOptions) {
        const latestAnnualReportYear = await this.#getLatestAnnualReportYear();
        fillOptions['year'] = latestAnnualReportYear;
        this.#fillStatementWithSpecificYear(fillOptions);
        this.statement[0]['year'] = latestAnnualReportYear;
    }
    async #fillStatementWithHistoricalAnnual(fillOptions) {
        const cikCode = CikCodeCoverter.normalizeCikCode(fillOptions.SECResponse.cik);
        const availableYears = await APIResponseAnnualProcessor.getAvailableAnnualYears(cikCode);
        this.statement = [];
        for (let i = 0; i < availableYears.length; i++) {
            this.statement[i] = this.#getOrganizedValuesFromResponse(fillOptions.SECResponse, fillOptions.concepts, { valueType: "specificYear", year: availableYears[i] });
            this.statement[i]["year"] = availableYears[i];
        }
    }
    #fillStatementWithLatestQuarter(fillOptions) {
        this.statement = [
            this.#getOrganizedValuesFromResponse(fillOptions.SECResponse, fillOptions.concepts, { valueType: "quarter", quarterIndex: 3 })
        ];
    }
    #fillStatementLatestQuarters(fillOptions) {
        this.statement = [];
        for (let i = 0; i < 4; i++) {
            this.statement[i] = this.#getOrganizedValuesFromResponse(fillOptions.SECResponse, fillOptions.concepts, { valueType: "quarter", quarterIndex: i });
        }
    }
    #fillStatementWithTTMValues(fillOptions) {
        this.statement = [this.#getOrganizedValuesFromResponse(fillOptions.SECResponse, fillOptions.concepts, { valueType: "TTM" })];
    }
    #getOrganizedValuesFromResponse(res, concepts, tryGetValueOptions) {
        let result = {};
        const rawConcepts = NestedObjectsTools.getObjectWithoutSections(concepts);
        for (const key in rawConcepts) {
            const conceptInResponse = this.#getUsGaapConceptInGeneralResponse(rawConcepts[key], res);
            result[key] = this.#tryGetValueFromConceptBlocks(conceptInResponse, tryGetValueOptions);
        }
        return result;
    }
    #tryGetValueFromConceptBlocks(conceptBlocks, options) {
        try {
            if (options.valueType == "TTM") {
                const quarterData = APIResponseQuarterProcessor.getLatestQuarterValues(conceptBlocks);
                let sum = quarterData.reduce((acc, value) => acc + value, 0);
                return sum;
            }
            else if (options.valueType == "quarter") {
                const quarterData = APIResponseQuarterProcessor.getLatestQuarterValues(conceptBlocks);
                return quarterData[options.quarterIndex];
            }
            else if (options.valueType == "specificYear") {
                const yearData = APIResponseAnnualProcessor.getSpecificYearAnnualReport(conceptBlocks, options.year);
                return yearData.value;
            }
        }
        catch (err) {
            return this.#getDefaultReturnValue();
        }
    }
    #getDefaultReturnValue() {
        return null;
    }
    #validateResponse(res) {
        if (!this.#isResponseOk(res)) {
            throw new Error('could not fetch correctly because the response was not ok');
        }
    }
    #isResponseOk(res) {
        return res.ok;
    }
    async #getResponseInJson(res) {
        return await res.json();
    }
    async #fetchGeneralURL() {
        const keyURL = URLConverter.getCompanyFactsUrl(this.cikCode);
        const res = await APIRateLimitedFetch(keyURL);
        return res;
    }
    #getUsGaapConceptInGeneralResponse(concept, res) {
        return res.facts['us-gaap'][concept];
    }
    async #getLatestAnnualReportYear() {
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
module.exports = StatementMaker;
