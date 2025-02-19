import {describe, it, expect} from "vitest";
const StatementsMaker = require('../statementMaker');
const testInputs = require('../../tests/testInputs.json');
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
        {period1:startYear, module: 'financials', type: "annual"}
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

async function getLatestQuartersAssetsValuesFromYahoo(){
    const startYear = new Date(`${(new Date()).getFullYear() - 1}-01-01`);
    const yahooStatements = await yahooFinance.fundamentalsTimeSeries(
        'AAPL',
        {period1:startYear, module: 'balance-sheet', type: "quarterly"}
    );
    const yahooAssets = [];
    // @ts-ignore
    for (const statement of yahooStatements){
        yahooAssets.push(statement.totalAssets);
    }
    return yahooAssets;
}

describe('statements maker income test', () => {
    it('should return values for latest quarters equal to the one in yahoo finance', async ()=> {
        const yahooRevenues = await getLatestQuartersRevenueValuesFromYahoo();
        const superMaker = new StatementsMaker();
        const latestQuarterValues = await superMaker.getStatement('AAPL', {financialStatement: 'income', reportingPeriod: 'latestQuarters'});

        for (let i = 0; i < 4; i ++){
            expect(latestQuarterValues[i].revenue).toBe(yahooRevenues[i]);
        }
    })

    it('should return the latest TTM value equal to the one in yahoo finance', async ()=> {
        const yahooTTMRevenue = await getTTMRevenueValueFromYahoo();
        const superMaker = new StatementsMaker();
        const superTTMRevenue = await superMaker.getStatement('AAPL', {financialStatement: "income", reportingPeriod: "ttm"});

        expect(superTTMRevenue[0].revenue).toBe(yahooTTMRevenue);
    })

    it('should return at least the three latest annual reports data', async () => {
        const yahooRevenues = await getLatestThreeAnnualRevenuesFromYahoo();
        const superMaker = new StatementsMaker();
        const superRevenues = await superMaker.getStatement('AAPL', {financialStatement: "income", reportingPeriod: "historicalAnnual"});

        let yahooIndex = 0;
        for (let i = superRevenues.length - 3; i < superRevenues.length; i++){
            expect(superRevenues[i].revenue).toBe(yahooRevenues[yahooIndex]);
            yahooIndex++;
        }
    }, 10000)
})

describe('statements maker bs test', () => {
    it('should return values for latest quarters equal to the one in yahoo finance', async ()=> {
        const yahooAssets = await getLatestQuartersAssetsValuesFromYahoo();
        const superMaker = new StatementsMaker();
        const latestQuarterValues = await superMaker.getStatement('AAPL', {financialStatement: 'balance', reportingPeriod: 'latestQuarters'});

        for (let i = 0; i < 4; i ++){
            expect(latestQuarterValues[i].totalAssets).toBe(yahooAssets[i]);
        }
    })

    it('should return at least the three latest annual reports data', async () => {
        const superMaker = new StatementsMaker();
        const superAssets = await superMaker.getStatement('AAPL', {financialStatement: "balance", reportingPeriod: "historicalAnnual"});

        let yahooIndex = 0;
        for (let i = superAssets.length - 3; i < superAssets.length; i++){
            expect(typeof superAssets[i].totalAssets).toBe('number');
            yahooIndex++;
        }
    }, 15000)
})

describe('statement maker errors test', ()=>{
    it('should return an error', async ()=>{
        const superMaker = new StatementsMaker();
        let gotError = false;
        try{
            const latestQuarterValues = await superMaker.getStatement('INTENTIONAL ERROR', {financialStatement:     'balance', reportingPeriod: 'latestQuarters'});
        } catch(err){
            gotError = true;
        }
        expect(gotError).toBe(true);
    })
})
