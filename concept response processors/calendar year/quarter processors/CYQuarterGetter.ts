import ConceptResponseBlockConverter = require('../../raw response processors/conceptResponseBlockGetter');
import BlockCalendarYearAnalyzer = require('../block analyzis/blockCYAnalyzer');
import CYHiddenQuarterHandler = require('./response fixes/CYHiddenQuarterHandler');

class CYQuarterGetter {
    static getSpecificQuarterData(conceptResponse, year: string, quarter: number){
        const blocks = ConceptResponseBlockConverter.getExtractedBlocksFromConceptResponse(conceptResponse);
        for (let i = 0; i < blocks.length; i++){
            const block = blocks[i];
            const isBlockTheTarget = BlockCalendarYearAnalyzer.isBlockCoveringTargetYearAndQuarter(block, year, quarter);
            const doesBlockContainHiddenQuarter = CYHiddenQuarterHandler.doesBlockContainHiddenQuarter(block, year);
            if (isBlockTheTarget){
                return this.#getKeyInformationFromBlock(block);
            } else if (doesBlockContainHiddenQuarter){
                const theoricalQuarter = CYHiddenQuarterHandler.getHiddenQuarterSupposedQNumber(conceptResponse, i);
                if (+theoricalQuarter == quarter){
                    const remadeBlock = CYHiddenQuarterHandler.getTheoricalHiddenQuarterBlock(conceptResponse, i, year);
                    return this.#getKeyInformationFromBlock(remadeBlock);
                }
            }
        }
        throw new Error('target not found');
    }

    static #getKeyInformationFromBlock(block){
        let year = block['frame'].split("Y")[1];
        if (year.length >= 5){
            year = year.substring(0, 4);
        }
        let quarter = block["frame"].split('Q')[1][0];
        return {CY: year, quarter: quarter, value: +block['val']};
    }
}

export = CYQuarterGetter;