import {describe, it, expect} from "vitest";
const IncomeStatementGetter = require('../statement makers/incomeStatementGetter');
const StatementsmakerSuper = require('../statement makers/super classes/statementMakerSuper');
const testInputs = require('./testInputs.json');
const yahooFinance = require('yahoo-finance2').default;

async function getLatestQuartersRevenueValuesFromYahoo(){
    const startYear = new Date(`${(new Date()).getFullYear() - 1}-01-01`);
    const yahooStatements = await yahooFinance.fundamentalsTimeSeries(
        'AAPL',
        {period1:startYear, module: 'financials', type: "quarterly"}
    );
    const yahooRevenues = [];
    // @ts-ignore
    for (const statement of yahooStatements){
        yahooRevenues.push(statement.totalRevenue);
    }
    return yahooRevenues;
}

async function getTTMRevenueValueFromYahoo(){
    const yahooRevenues = await getLatestQuartersRevenueValuesFromYahoo();
    let ttm = yahooRevenues.reduce((acc, value) => acc + value, 0);
    return ttm;
}

async function getLatestThreeAnnualRevenuesFromYahoo(){
    const startYear = new Date(`${(new Date()).getFullYear() - 4}-01-01`);
    const yahooStatements = await yahooFinance.fundamentalsTimeSeries(
        'AAPL',
        {period1:startYear, module: 'financials', type: "quarterly"}
    );
    const yahooRevenues = [];
    // @ts-ignore
    for (let i = yahooStatements.length - 1; i > 0; i--){
        yahooRevenues.unshift(yahooStatements[i].totalRevenue);
        if (yahooRevenues.length >= 3){
            break;
        }
    }
    return yahooRevenues;
}

describe('statements maker super test', () => {
    it('should return values for latest quarters equal to the one in yahoo finance', async ()=> {
        const yahooRevenues = await getLatestQuartersRevenueValuesFromYahoo();
        const superMaker = new StatementsmakerSuper();
        const latestQuarterValues = await superMaker.getLatestQuarterStatements('AAPL', {revenue: testInputs.revenueConcept});

        for (let i = 1; i < 5; i ++){
            expect(latestQuarterValues[`Q${i}`].revenue).toBe(yahooRevenues[i - 1]);
        }
    })

    it('should return the latest TTM value equal to the one in yahoo finance', async ()=> {
        const yahooTTMRevenue = await getTTMRevenueValueFromYahoo();
        const superMaker = new StatementsmakerSuper();
        const superTTMRevenue = await superMaker.getTTMStatement('AAPL', {revenue: testInputs.revenueConcept});

        expect(superTTMRevenue.revenue).toBe(yahooTTMRevenue);
    })

    it('should return at least the three latest annual reports data', async () => {
        const yahooRevenues = await getLatestThreeAnnualRevenuesFromYahoo();
        const superMaker = new StatementsmakerSuper();
        const superRevenues = await superMaker.getHistoricalAnnualStatements('AAPL', {revenue: testInputs.revenueConcept});

        let yahooIndex = 0;
        for (let i = superRevenues.length - 4; i < superRevenues.length; i++){
            expect(superRevenues[i].revenue).toBe(yahooRevenues[yahooIndex]);
            yahooIndex++;
        }
    }, 10000)
})
