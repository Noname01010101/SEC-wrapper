"use strict";
const ConceptResponseBlockConverter = require("../../raw response processors/conceptResponseBlockGetter");
const BlockCalendarYearAnalyzer = require("../block analyzis/blockCYAnalyzer");
const CYHiddenQuarterHandler = require("./response fixes/CYHiddenQuarterHandler");
class CYQuarterGetter {
    static getSpecificQuarterData(conceptResponse, year, quarter) {
        const blocks = ConceptResponseBlockConverter.getExtractedBlocksFromConceptResponse(conceptResponse);
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const isBlockTheTarget = BlockCalendarYearAnalyzer.isBlockCoveringTargetYearAndQuarter(block, year, quarter);
            const doesBlockContainHiddenQuarter = CYHiddenQuarterHandler.doesBlockContainHiddenQuarter(block, year);
            if (isBlockTheTarget) {
                return this.#getKeyInformationFromBlock(block);
            }
            else if (doesBlockContainHiddenQuarter) {
                const remadeBlock = CYHiddenQuarterHandler.getTheoricalHiddenQuarterBlock(conceptResponse, i, year);
                return this.#getKeyInformationFromBlock(remadeBlock);
            }
        }
        throw new Error('target not found');
    }
    static #getKeyInformationFromBlock(block) {
        let year = block['frame'].split("Y")[1];
        if (year.length >= 5) {
            year = year.substring(0, 4);
        }
        let quarter = block["frame"].split('Q')[1][0];
        return { CY: year, quarter: quarter, value: +block['val'] };
    }
}
module.exports = CYQuarterGetter;
