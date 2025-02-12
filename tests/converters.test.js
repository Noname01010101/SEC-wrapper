import * as vitest from "vitest";
const CikCodeConverter = require('../converters/cikCodeConverter');
const URLConverter = require('../converters/urlConverter');
const concepts = require('../concepts/standardConcepts.json').incomeStatement;

vitest.describe('convertions test', () => {
    vitest.it('should return the actual cik code corresponding to the symbol', async () => {
        const response = await CikCodeConverter.getSymbolCikCodeWithoutCIKKeyword('AAPL');
        vitest.expect(response).toBe("0000320193");
    })

    vitest.it('should return a valid response from the generated url', async () => {
        const conceptTest = concepts.revenue;
        const testCikCode = await CikCodeConverter.getSymbolCikCodeWithoutCIKKeyword("AAPL");
        const url = await URLConverter.getConceptURL(testCikCode, conceptTest);
        const response = await fetch(url);
        const responseJSON = await response.json();
        vitest.expect(typeof responseJSON).toBe("object");
    })
});