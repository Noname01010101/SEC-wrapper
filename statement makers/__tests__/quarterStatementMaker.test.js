import {describe, it, expect, beforeAll} from "vitest";
const QuarterStatementMaker = require('../quarterStatementMaker');
const testCommonTools = require('./testsCommonTools');

var companyFacts;
const stdConcepts = require('../../concepts/standardConcepts.json');

describe('quarter statement maker historical quarters test', ()=> {
    beforeAll(async ()=> {
        companyFacts = await testCommonTools.getAAPLCompanyFacts();
    })

    it('History of quarterly income statements', ()=> {
        const historyStatements = QuarterStatementMaker.getHistoricalQuarterStatements(companyFacts, stdConcepts.income, testCommonTools.getTwoYearsTimeOption());
        for (const statement of historyStatements){
            expect(typeof statement.revenue).toBe("number");
        }
    });

    it('History of quarterly balance statements', ()=> {
        const historyStatements = QuarterStatementMaker.getHistoricalQuarterStatements(companyFacts, stdConcepts.balance, testCommonTools.getTwoYearsTimeOption());
        for (const statement of historyStatements){
            expect(typeof statement.totalAssets).toBe("number");
        }
    });

    it('History of quarterly misc statements', ()=> {
        const historyStatements = QuarterStatementMaker.getHistoricalQuarterStatements(companyFacts, stdConcepts.miscellaneous, testCommonTools.getTwoYearsTimeOption());
        for (const statement of historyStatements){
            expect(typeof statement.outstandingShares).toBe("number");
        }
    });
})

describe('quarter statement maker specific quarter test', ()=> {
    beforeAll(async ()=> {
        companyFacts = await testCommonTools.getAAPLCompanyFacts();
    })

    it('specific quarter income statement', ()=> {
        const statement = QuarterStatementMaker.getQuarterStatement(companyFacts, stdConcepts.income, 2024, 3);
        expect(typeof statement['revenue']).toBe("number");
    });

    it('specific quarter balance statement', ()=> {
        const statement = QuarterStatementMaker.getQuarterStatement(companyFacts, stdConcepts.balance, 2024, 3);
        expect(typeof statement['totalAssets']).toBe("number");
    });

    it('specific quarter misc statement', ()=> {
        const statement = QuarterStatementMaker.getQuarterStatement(companyFacts, stdConcepts.miscellaneous, 2024, 3);
        expect(typeof statement['outstandingShares']).toBe("number");
    });
})