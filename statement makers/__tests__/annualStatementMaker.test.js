import {describe, it, expect, beforeAll} from "vitest";
const AnnualStatementMaker = require('../annualStatementMaker');
const testCommonTools = require('./testsCommonTools');

var companyFactsArray;
const stdConcepts = require('../../concepts/standardConcepts.json');

describe('annualStatementMaker annual history test', ()=> {
    beforeAll(async ()=> {
        companyFactsArray = await testCommonTools.getMainCompaniesFacts();
    })

    it('History of annual income statements', async () => {
        for (const companyFacts of companyFactsArray) {
            const historicalStatements = await AnnualStatementMaker.getHistoricalAnnualStatement(
                companyFacts, 
                stdConcepts.income, 
                testCommonTools.getTwoYearsTimeOption()
            );
            expect(historicalStatements.length).toBeGreaterThanOrEqual(1);

            for (const statement of historicalStatements) {
                expect(typeof statement.revenue).toBe("number");
            }
        }
    });

    it('History of annual balance statements', async () => {
        for (const companyFacts of companyFactsArray) {
            const historicalStatements = await AnnualStatementMaker.getHistoricalAnnualStatement(
                companyFacts, 
                stdConcepts.balance, 
                testCommonTools.getTwoYearsTimeOption()
            );
            expect(historicalStatements.length).toBeGreaterThanOrEqual(1);

            for (const statement of historicalStatements) {
                expect(typeof statement.totalAssets).toBe("number");
            }
        }
    });

    it('History of annual cashFlow statements', async () => {
        for (const companyFacts of companyFactsArray) {
            const historicalStatements = await AnnualStatementMaker.getHistoricalAnnualStatement(
                companyFacts, 
                stdConcepts.cashFlow, 
                testCommonTools.getTwoYearsTimeOption()
            );
            expect(historicalStatements.length).toBeGreaterThanOrEqual(1);

            for (const statement of historicalStatements) {
                expect(typeof statement.totalCashGeneratedByOperatingActivities).toBe("number");
            }
        }
    });

    it('History of annual misc statements', async () => {
        for (const companyFacts of companyFactsArray) {
            const historicalStatements = await AnnualStatementMaker.getHistoricalAnnualStatement(
                companyFacts, 
                stdConcepts.miscellaneous, 
                testCommonTools.getTwoYearsTimeOption()
            );
            expect(historicalStatements.length).toBeGreaterThanOrEqual(1);

            for (const statement of historicalStatements) {
                expect(typeof statement.outstandingShares).toBe("number");
            }
        }
    });
});


describe('annualStatementMaker annual single test', () => {
    let companyFactsArray;

    beforeAll(async () => {
        companyFactsArray = await testCommonTools.getMainCompaniesFacts();
    });

    it('specific year income statement', async () => {
        for (const companyFacts of companyFactsArray) {
            const statement = await AnnualStatementMaker.getAnnualStatement(companyFacts, stdConcepts.income, "2023");
            expect(typeof statement['revenue']).toBe("number");
        }
    });

    it('specific year balance statement', async () => {
        for (const companyFacts of companyFactsArray) {
            const statement = await AnnualStatementMaker.getAnnualStatement(companyFacts, stdConcepts.balance, "2023");
            expect(typeof statement['totalAssets']).toBe("number");
        }
    });

    it('specific year cashflow statement', async () => {
        for (const companyFacts of companyFactsArray) {
            const statement = await AnnualStatementMaker.getAnnualStatement(companyFacts, stdConcepts.cashFlow, "2023");
            expect(typeof statement['totalCashGeneratedByOperatingActivities']).toBe("number");
        }
    });

    it('specific year misc statement', async () => {
        for (const companyFacts of companyFactsArray) {
            const statement = await AnnualStatementMaker.getAnnualStatement(companyFacts, stdConcepts.miscellaneous, "2023");
            expect(typeof statement['outstandingShares']).toBe("number");
        }
    });
});
