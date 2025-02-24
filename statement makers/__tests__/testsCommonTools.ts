import testInputs = require('../../tests/testInputs.json');
import concepts = require('../../concepts/standardConcepts.json');
import { GeneralTimeOptions } from '../../concept response processors/time options/generalTimeOptions.type';

async function getAAPLCompanyFacts(){
    const res = await fetch(testInputs.AAPLCompanyFactsURL);
    if (res.ok){
        return await res.json();
    } else {
        throw new Error('request error for company facts: response was not ok');
    }
}

function getTwoYearsTimeOption() : GeneralTimeOptions{
    const now = new Date();
    const twoYAgo = new Date();
    twoYAgo.setFullYear(now.getFullYear() - 2);

    return {startYear: twoYAgo.getFullYear().toString()};
}

export = {getAAPLCompanyFacts, getTwoYearsTimeOption};