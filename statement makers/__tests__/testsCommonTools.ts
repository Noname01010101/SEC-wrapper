import testInputs = require('../../tests/testInputs.json');
import rateLimit = require('../../SEC requirements/rateLimit')
import { GeneralTimeOptions } from '../../concept response processors/time options/generalTimeOptions.type';
import cikCodeConverter = require('../../converters/cikCodeConverter')
import urlConverter = require('../../converters/urlConverter')

async function getAAPLCompanyFacts(){
    const res = await rateLimit.APIRateLimitedFetch(testInputs.AAPLCompanyFactsURL);
    if (res.ok){
        return await res.json();
    } else {
        throw new Error('request error for company facts: response was not ok');
    }
}

async function getMainCompaniesFacts(){
    const mainCompanies = ['AAPL', 'MSFT', 'TSLA', 'GOOGL'];
    const facts = [];
    for (const symbol of mainCompanies){
        const cikCode = await cikCodeConverter.getSymbolCikCodeWithoutCIKKeyword(symbol);
        const url = urlConverter.getCompanyFactsUrl(cikCode);
        const res = await rateLimit.APIRateLimitedFetch(url);
        if (res.ok){
            facts.push(await res.json());
        } else {
            throw new Error('request error for company facts: response was not ok');
        }
    }
    return facts;
}

function getTwoYearsTimeOption() : GeneralTimeOptions{
    const now = new Date();
    const twoYAgo = new Date();
    twoYAgo.setFullYear(now.getFullYear() - 2);

    return {startYear: twoYAgo.getFullYear().toString()};
}

export = {getAAPLCompanyFacts, getTwoYearsTimeOption, getMainCompaniesFacts};