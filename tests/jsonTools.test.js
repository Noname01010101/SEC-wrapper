import {describe, it, expect} from "vitest";
const sectionInit = require('../json tools/sectionInitializer');

const exampleObj = {
    section1: {

    },

    randomNum: 1,

    section2: {
        subSection: {
            subSubSection: {
                randomNum: 1
            }
        }
    }
}

const expectedResult = {
    section1: {

    },
    section2: {
        subSection: {
            subSubSection: {
            }
        }
    }
}

describe('json tools test', () => {
    it('should return an object with only the sections and sub sections and so on of the example object', ()=>{
        const result = sectionInit(exampleObj);
        expect(result).toStrictEqual(expectedResult);
    })
})