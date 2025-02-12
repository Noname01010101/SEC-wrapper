import * as vitest from "vitest";
const APIResponseAnnualProcessor = require('../processors/APIResponseAnnualProcessor');
const testInputs = require('./testInputs.json');

vitest.describe("processors test", () => {
    vitest.it('should return arrays with valid values', async () => {
        for(const code of testInputs.cikCodes){
            const URL = `https://data.sec.gov/api/xbrl/companyconcept/CIK${code}/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json`;
            const res = await fetch(URL);
            const parsedJSON = await res.json();
            const result = APIResponseAnnualProcessor.getAnnualOnly(parsedJSON);

            for (let element of result){
                vitest.expect(typeof(element.value)).toBe("number");
            }
        }
    })
});