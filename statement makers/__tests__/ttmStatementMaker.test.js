import {describe, it, expect, beforeAll} from "vitest";
const ttmStatementMaker = require('../ttmStatementMaker')
const testCommonTools = require('./testsCommonTools');

var companyFacts;
const stdConcepts = require('../../concepts/standardConcepts.json');

describe('ttm statement maker test', ()=> {
    beforeAll(async ()=> {
        companyFacts = await testCommonTools.getAAPLCompanyFacts();
    })

    it('ttm income statement', ()=> {
        const statement = ttmStatementMaker.getTTMStatement(companyFacts, stdConcepts.income)
        expect(typeof statement['revenue']).toBe("number");
    }, 99999);

    it('ttm balance statement', ()=> {
        const statement = ttmStatementMaker.getTTMStatement(companyFacts, stdConcepts.balance)
        expect(typeof statement['totalAssets']).toBe("number");
    });

    it('ttm cashflow statement', ()=> {
        const statement = ttmStatementMaker.getTTMStatement(companyFacts, stdConcepts.cashFlow)
        expect(typeof statement['totalCashGeneratedByOperatingActivities']).toBe("number");
    });

    it('ttm misc statement', ()=> {
        const statement = ttmStatementMaker.getTTMStatement(companyFacts, stdConcepts.miscellanous)
        expect(typeof statement['outstandingShares']).toBe("number");
    });
})