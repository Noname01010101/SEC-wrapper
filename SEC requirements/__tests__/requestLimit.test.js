import {describe, it, expect, test} from "vitest";
const testInputs = require('../../tests/testInputs.json');
const APIRateLimitedFetch = require('../rateLimit').APIRateLimitedFetch;

function isResponseValid(res){
    if (!res.ok || res.status != 200){
        return false;
    }
    return true;
}

describe("rate limit fetcher test", () => {
    it('should return valid values for every response', async ()=> {
        const url = testInputs.APIUrlTest;
        for(let i = 0; i < 20; i++){
            const res = await APIRateLimitedFetch(url);
            expect(isResponseValid(res)).toBe(true);
        }
    }, 30000)
})

