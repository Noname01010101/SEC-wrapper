import CikCodeCoverter = require('../converters/cikCodeConverter');
import URLConverter = require('../converters/urlConverter');

import AnnualStatementMaker = require('../statement makers/annualStatementMaker');
import QuarterStatementMaker = require('../statement makers/quarterStatementMaker');
import TTMStatementMaker = require('../statement makers/ttmStatementMaker');


import rateLimit = require('../SEC requirements/rateLimit');
const APIRateLimitedFetch = rateLimit.APIRateLimitedFetch;
import StandardConcepts = require('../concepts/standardConcepts.json');
import { statementType } from './types/statementTypes.type';
import { GeneralTimeOptions } from '../concept response processors/time options/generalTimeOptions.type';
import nestedObjectsTools = require('../json tools/nestedObjectsTools');

class StatementMaker {
    static async #getGeneralResponse(symbol: string){
        const cikCode = await CikCodeCoverter.getSymbolCikCodeWithoutCIKKeyword(symbol);
        const keyURL = URLConverter.getCompanyFactsUrl(cikCode);
        const res = await APIRateLimitedFetch(keyURL);
        this.#validateResponse(res);
        const resJSON = await res.json();
        return resJSON;
    };

    static #getConceptFromType(statementType: statementType){
        return StandardConcepts[statementType];
    }
    static #getProcessedConcepts(concepts){
        return nestedObjectsTools.getObjectWithoutSections(concepts);
    }

    static async getAnnualSpecificYear(symbol: string, year: string, statementType: statementType){
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);

        const statement = AnnualStatementMaker.getAnnualStatement(generalResponse, processedConcepts, year);
        return statement;
    } 
    static async getHistoricalAnnual(symbol: string, statementType: statementType, timeOptions: GeneralTimeOptions){
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);

        const statement = AnnualStatementMaker.getHistoricalAnnualStatement(generalResponse, processedConcepts, timeOptions);
        return statement;
    }

    static async getLatestQuarter(symbol: string, statementType: statementType){
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);

        const statement = QuarterStatementMaker.getLatestQuarterStatement(generalResponse, processedConcepts);
        return statement;
    }

    static async getHistoricalQuarters(symbol: string, statementType: statementType, timeOptions: GeneralTimeOptions){
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);

        const statement = QuarterStatementMaker.getHistoricalQuarterStatements(generalResponse, processedConcepts, timeOptions);
        return statement;
    }

    static async getSpecificQuarter(symbol: string, statementType: statementType, year: string, quarter: 1 | 2 | 3 | 4){
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);

        const statement = QuarterStatementMaker.getQuarterStatement(generalResponse, processedConcepts, year, quarter);
        return statement;
    }

    static async getTTMStatement(symbol: string, statementType: statementType){
        const generalResponse = await this.#getGeneralResponse(symbol);
        const rawConcepts = this.#getConceptFromType(statementType);
        const processedConcepts = this.#getProcessedConcepts(rawConcepts);

        const statement = TTMStatementMaker.getTTMStatement(generalResponse, processedConcepts);
        return statement;
    }

    static #validateResponse(res){
        if (!this.#isResponseOk(res)){
            throw new Error('could not fetch correctly because the response was not ok');
        }
    }
    static #isResponseOk(res){
        return res.ok;
    }
}

export = StatementMaker