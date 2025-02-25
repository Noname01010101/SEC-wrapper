import { describe, it, expect} from "vitest"
const TimeOptionsTools = require('../historicalTimeOptionsTools');

describe('time option tools tests', ()=> {
    it('should return a fullfiled timeOption', ()=> {
        const rawTimeOption = {startYear: "2020"};
        const filledTimeOption = TimeOptionsTools.getTimeOptionsWithAddedDefaultValuesIfUndefined(rawTimeOption);
        expect(filledTimeOption.startYear).toBe("2020");
        expect(filledTimeOption.endYear).toBeDefined();
    })

    it('should return all the years in between as well as the end numbers', ()=> {
        const timeOptions = {startYear: "2019", endYear: "2024"};
        const consecutive = TimeOptionsTools.getAllConsecutiveYearsFromTimeOptions(timeOptions);
        for (let i = 2019; i < 2025; i++){
            expect(consecutive[i - 2019]).toBe(i.toString());
        }
    })
});