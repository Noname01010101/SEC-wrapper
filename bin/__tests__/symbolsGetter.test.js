const SymbolsGetter = require('../symbolsGetter');
import { describe, it, expect } from 'vitest';

describe('symbols getter test', ()=>{
    it('should return a list of available symbols', async ()=> {
        const availableSymbols = await SymbolsGetter.getAllSymbolsInSEC();
        expect(typeof availableSymbols[0]).toBe("string");
    })

    it ('should return a list of available cik codes', async ()=> {
        const availableCIK = await SymbolsGetter.getAllCikCodesInSEC();
        expect(typeof availableCIK[0]).toBe("string");
        expect(availableCIK[0].length).toBe(10);
    })
})