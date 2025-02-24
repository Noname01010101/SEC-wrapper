"use strict";
const CikCodeCoverter = require("../converters/cikCodeConverter");
const URLConverter = require("../converters/urlConverter");
const AnnualStatementMaker = require("../statement makers/annualStatementMaker");
const QuarterStatementMaker = require("../statement makers/quarterStatementMaker");
const TTMStatementMaker = require("../statement makers/ttmStatementMaker");
const rateLimit = require("../SEC requirements/rateLimit");
const APIRateLimitedFetch = rateLimit.APIRateLimitedFetch;
const StandardConcepts = require("../concepts/standardConcepts.json");
const nestedObjectsTools = require("../json tools/nestedObjectsTools");
class StatementMaker {
    static async #getGeneralResponse(symbol) {
        const cikCode = await CikCodeCoverter.getSymbolCikCodeWithoutCIKKeyword(symbol);
        const keyURL = URLConverter.getCompanyFactsUrl(cikCode);
        const res = await APIRateLimitedFetch(keyURL);
        this.#validateResponse(res);
        const resJSON = await res.json();
        return resJSON;
    }
    ;
    static #getConceptFromType(statementType) {
        return StandardConcepts[statementType];
    }
    static #getProcessedConcepts(concepts) {
        return nestedObjectsTools.getObjectWithoutSections(concepts);
    }
    static async getAnnualSpecificYear(symbol, year, statementType) {
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);
        const statement = AnnualStatementMaker.getAnnualStatement(generalResponse, processedConcepts, year);
        return statement;
    }
    static async getHistoricalAnnual(symbol, statementType, timeOptions) {
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);
        const statement = AnnualStatementMaker.getHistoricalAnnualStatement(generalResponse, processedConcepts, timeOptions);
        return statement;
    }
    static async getLatestQuarter(symbol, statementType) {
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);
        const statement = QuarterStatementMaker.getLatestQuarterStatement(generalResponse, processedConcepts);
        return statement;
    }
    static async getHistoricalQuarters(symbol, statementType, timeOptions) {
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);
        const statement = QuarterStatementMaker.getHistoricalQuarterStatements(generalResponse, processedConcepts, timeOptions);
        return statement;
    }
    static async getSpecificQuarter(symbol, statementType, year, quarter) {
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);
        const statement = QuarterStatementMaker.getQuarterStatement(generalResponse, processedConcepts, year, quarter);
        return statement;
    }
    static async getTTMStatement(symbol, statementType) {
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);
        const statement = TTMStatementMaker.getTTMStatement(generalResponse, processedConcepts);
        return statement;
    }
    static #validateResponse(res) {
        if (!this.#isResponseOk(res)) {
            throw new Error('could not fetch correctly because the response was not ok');
        }
    }
    static #isResponseOk(res) {
        return res.ok;
    }
}
module.exports = StatementMaker;
