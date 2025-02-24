"use strict";
class BlockCYAnalyzer {
    static areBlocksInterim(blocks) {
        for (const block of (blocks)) {
            if (block["frame"] != undefined) {
                return block["frame"]?.includes("I") ?? false;
            }
        }
        throw new Error('could not find any block with frame defined');
    }
    static isBlockCoveringAnyRegularFullCalendarYear(block) {
        if (!this.#isBlockInCalendarYear(block)) {
            return false;
        }
        ;
        if (block["frame"]?.length == 6) {
            return true;
        }
        return false;
    }
    static isBlockCoveringASpecificRegularFullCalendarYear(block, year) {
        if (this.isBlockCoveringAnyRegularFullCalendarYear(block)) {
            if (block["frame"]?.includes(year) ?? false) {
                return true;
            }
        }
        return false;
    }
    static isBlockCoveringAnyQuarter(block) {
        if (block["frame"]?.includes(`Q`) ?? false) {
            return true;
        }
        else {
            return false;
        }
    }
    static isBlockCoveringASpecificQuarterNumber(block, quarterNumber) {
        if (block["frame"]?.includes(`Q${quarterNumber}`) ?? false) {
            return true;
        }
        return false;
    }
    static isBlockFromASpecificYear(block, year) {
        let blockYear = block['frame']?.split("Y")[1] ?? false;
        if (blockYear.length >= 5) {
            blockYear = blockYear.substring(0, 4);
        }
        return blockYear == year;
    }
    static isBlockCoveringAFullInterimSpecificYear(block, year) {
        const isBlockFromYear = this.isBlockFromASpecificYear(block, year);
        const isBlockCoveringGeneralQuarter = this.isBlockCoveringASpecificQuarterNumber(block, 4);
        return isBlockFromYear && isBlockCoveringGeneralQuarter;
    }
    static isBlockCoveringTargetYearAndQuarter(block, year, quarter) {
        const isBlockCoveringTheTargetYear = this.isBlockFromASpecificYear(block, year);
        const isBlockCoveringTheTargetQuarter = this.isBlockCoveringASpecificQuarterNumber(block, quarter);
        const isBlockTheTarget = isBlockCoveringTheTargetYear && isBlockCoveringTheTargetQuarter;
        return isBlockTheTarget;
    }
    static #isBlockInCalendarYear(block) {
        return block["frame"] != undefined;
    }
}
module.exports = BlockCYAnalyzer;
