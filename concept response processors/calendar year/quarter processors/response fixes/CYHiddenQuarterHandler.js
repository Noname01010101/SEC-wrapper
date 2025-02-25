"use strict";
const BlockCalendarYearAnalyzer = require("../../block analyzis/blockCYAnalyzer");
const ConceptResponseBlockConverter = require("../../../raw response processors/conceptResponseBlockGetter");
class CYHiddenQuarterHandler {
    static getTheoricalHiddenQuarterBlock(conceptResponse, blockIndex, year) {
        const hiddenValue = this.getHiddenQuarterValue(conceptResponse, blockIndex);
        const hiddenQuarterNumber = this.getHiddenQuarterSupposedQNumber(conceptResponse, blockIndex);
        const remadeBlock = {
            val: hiddenValue,
            frame: `CY${year}Q${hiddenQuarterNumber}`
        };
        return remadeBlock;
    }
    static getHiddenQuarterSupposedQNumber(conceptResponse, blockIndex) {
        const blocks = ConceptResponseBlockConverter.getExtractedBlocksFromConceptResponse(conceptResponse);
        let lastQuarter = 0;
        let supposed = 0;
        for (let i = blockIndex; i > 0; i--) {
            const block = blocks[i];
            if (BlockCalendarYearAnalyzer.isBlockCoveringAnyQuarter(block)) {
                lastQuarter = block["frame"].split('Q')[1][0];
                break;
            }
        }
        supposed = (+lastQuarter) + 1;
        if (supposed >= 5) {
            supposed = 1;
        }
        else if (supposed <= 0) {
            throw new Error('could not find supposed quarter number of the hidden quarter');
        }
        return `${supposed}`;
    }
    static getHiddenQuarterValue(conceptResponse, blockIndex) {
        const blocks = ConceptResponseBlockConverter.getExtractedBlocksFromConceptResponse(conceptResponse);
        let ytdValueForCalcs = 0;
        const annualBlockValue = blocks[blockIndex].val;
        for (let i = blockIndex; i > 0; i--) {
            const block = blocks[i];
            if (BlockCalendarYearAnalyzer.isBlockCoveringAnyQuarter(block)) {
                ytdValueForCalcs = blocks[i - 1].val;
                break;
            }
        }
        const value = annualBlockValue - ytdValueForCalcs;
        return value;
    }
    static doesBlockContainHiddenQuarter(block, year) {
        return BlockCalendarYearAnalyzer.isBlockCoveringASpecificRegularFullCalendarYear(block, year);
    }
}
module.exports = CYHiddenQuarterHandler;
