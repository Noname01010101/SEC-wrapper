"use strict";
const ConceptResponseBlockConverter = require("../../raw response processors/conceptResponseBlockGetter");
const BlockCalendarYearAnalyzer = require("../block analyzis/blockCYAnalyzer");
class CYAnnualGetter {
    static getYearAnnualData(conceptResponse, year) {
        const blocks = ConceptResponseBlockConverter.getExtractedBlocksFromConceptResponse(conceptResponse);
        const areBlocksInterim = BlockCalendarYearAnalyzer.areBlocksInterim(blocks);
        if (areBlocksInterim) {
            return this.#getYearAnnualDataInterim(blocks, year);
        }
        else {
            return this.#getYearAnnualDataRegular(blocks, year);
        }
    }
    static #getYearAnnualDataRegular(blocks, year) {
        for (const block of blocks) {
            if (BlockCalendarYearAnalyzer.isBlockCoveringASpecificRegularFullCalendarYear(block, year)) {
                return this.#getKeyInformationFromBlock(block);
            }
        }
        throw new Error('specific year\'s data not found from regular search');
    }
    static #getYearAnnualDataInterim(blocks, year) {
        for (const block of blocks) {
            if (BlockCalendarYearAnalyzer.isBlockCoveringAFullInterimSpecificYear(block, year)) {
                return this.#getKeyInformationFromBlock(block);
            }
        }
        throw new Error('specific year\'s data not found from balance search');
    }
    static #getKeyInformationFromBlock(block) {
        let date = block['frame'].split("Y")[1];
        if (date.length >= 5) {
            date = date.substring(0, 4);
        }
        return { CY: date, value: +block['val'] };
    }
}
module.exports = CYAnnualGetter;
