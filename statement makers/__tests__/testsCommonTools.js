"use strict";
const testInputs = require("../../tests/testInputs.json");
async function getAAPLCompanyFacts() {
    const res = await fetch(testInputs.AAPLCompanyFactsURL);
    if (res.ok) {
        return await res.json();
    }
    else {
        throw new Error('request error for company facts: response was not ok');
    }
}
function getTwoYearsTimeOption() {
    const now = new Date();
    const twoYAgo = new Date();
    twoYAgo.setFullYear(now.getFullYear() - 2);
    return { startYear: twoYAgo.getFullYear().toString() };
}
module.exports = { getAAPLCompanyFacts, getTwoYearsTimeOption };
