import {describe, it, expect} from "vitest";
const sectionInit = require('../nestedObjectsTools');

const exampleObj = {
    section1: {

    },

    randomNum1: 1,

    section2: {
        subSection: {
            subSubSection: {
                randomNum2: 1
            }
        }
    }
}

const expectedObjectWithoutSectionResult = {
    randomNum1: 1,
    randomNum2: 1
}

const expectedSectionOnlyResult = {
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
        const result = sectionInit.getSectionsOnlyObjectFromJson(exampleObj);
        expect(result).toStrictEqual(expectedSectionOnlyResult);
    })

    it('should return the object without nested objects', ()=> {
        const result = sectionInit.getObjectWithoutSections(exampleObj);
        expect(result).toStrictEqual(expectedObjectWithoutSectionResult);
    })
})