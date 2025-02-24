import {describe, it, expect, beforeAll} from "vitest";
const AnnualStatementMaker = require('../annualStatementMaker');
const testCommonTools = require('./testsCommonTools');

var companyFacts;
const stdConcepts = require('../../concepts/standardConcepts.json');

describe('annualStatementMaker annual history test', ()=> {
    beforeAll(async ()=> {
        companyFacts = await testCommonTools.getAAPLCompanyFacts();
    })

    it('History of annual income statements', async ()=> {
        const historicalStatements = await AnnualStatementMaker.getHistoricalAnnualStatement(companyFacts, stdConcepts.income, testCommonTools.getTwoYearsTimeOption());
        expect(historicalStatements.length).toBeGreaterThanOrEqual(1);

        for (const statement of historicalStatements){
            expect(typeof statement.revenue).toBe("number");
        }
    });

    it('History of annual balance statements', async ()=> {
        const historicalStatements = await AnnualStatementMaker.getHistoricalAnnualStatement(companyFacts, stdConcepts.balance, testCommonTools.getTwoYearsTimeOption());
        expect(historicalStatements.length).toBeGreaterThanOrEqual(1);

        for (const statement of historicalStatements){
            expect(typeof statement.totalAssets).toBe("number");
        }
    });

    it('History of annual cashFlow statements', async ()=> {
        const historicalStatements = await AnnualStatementMaker.getHistoricalAnnualStatement(companyFacts, stdConcepts.cashFlow, testCommonTools.getTwoYearsTimeOption());
        expect(historicalStatements.length).toBeGreaterThanOrEqual(1);

        for (const statement of historicalStatements){
            expect(typeof statement.totalCashGeneratedByOperatingActivities).toBe("number");
        }
    });

    it('History of annual misc statements', async ()=> {
        const historicalStatements = await AnnualStatementMaker.getHistoricalAnnualStatement(companyFacts, stdConcepts.miscellanous, testCommonTools.getTwoYearsTimeOption());
        expect(historicalStatements.length).toBeGreaterThanOrEqual(1);

        for (const statement of historicalStatements){
            expect(typeof statement.outstandingShares).toBe("number");
        }
    });
});


describe('annualStatementMaker annual single test', ()=> {
    it('specific year income statement', async ()=> {
        const statement = await AnnualStatementMaker.getAnnualStatement(companyFacts, stdConcepts.income, "2024");
        expect(typeof statement['revenue']).toBe("number");
    });

    it('specific year balance statement', async ()=> {
        const statement = await AnnualStatementMaker.getAnnualStatement(companyFacts, stdConcepts.balance, "2024");
        expect(typeof statement['totalAssets']).toBe("number");
    });

    it('specific year cashflow statement', async ()=> {
        const statement = await AnnualStatementMaker.getAnnualStatement(companyFacts, stdConcepts.cashFlow, "2024");
        expect(typeof statement['totalCashGeneratedByOperatingActivities']).toBe("number");
    });

    it('specific year misc statement', async ()=> {
        const statement = await AnnualStatementMaker.getAnnualStatement(companyFacts, stdConcepts.miscellanous, "2024");
        expect(typeof statement['outstandingShares']).toBe("number");
    });
});