const APIResponseProcessorSuper = require('./super classes/APIResponseProcessorSuper');

class APIResponseQuarterProcessor extends APIResponseProcessorSuper {

    static getLatestQuarterValues(conceptBlocks){
        let quarterData = [];
        const resBlocks = this.getAllBlocks(conceptBlocks);
        for (let i = resBlocks.length - 1; i > 0; i--){
            const block = resBlocks[i];
            const isQuarterExtractable = this.canQuarterBeExtractedFromBlock(block);
            if (isQuarterExtractable){
                const extractedQuarterValue = this.getQuarterDataFromBlock(resBlocks, i);
                quarterData.unshift(extractedQuarterValue);
            }
            if (quarterData.length == 4){
                break;
            }
        }
        APIResponseQuarterProcessor.#validateQuarterData(quarterData);
        return quarterData;
    }

    static canQuarterBeExtractedFromBlock(block){
        return this.doesBlockHaveFrame(block);
    }

    static getQuarterDataFromBlock(allBlocks, targetIndex){
        const block = allBlocks[targetIndex];
        const blockRefToQuarter = this.isBlockRefferingToQuarter(block);
        const blockRefToYear = this.isBlockRefferingToAnnual(block);
        if (blockRefToQuarter){
            return block.val;
        } else if (blockRefToYear){
            return this.getActualQuarterFromAnnual(allBlocks, targetIndex);
        }
    }

    static doesBlockHaveFrame(block){
        return block['frame'] != undefined
    }

    static isBlockRefferingToQuarter(block){
        if (this.doesBlockHaveFrame(block)){
            return block['frame'].includes('Q');
        } else {
            return false;
        }
    }

    static isBlockRefferingToAnnual(block){
        if (this.doesBlockHaveFrame(block)){
            return block['frame'].length == 6;
        } else {
            return false;
        }
    }

    static getActualQuarterFromAnnual(allBlocks, annualIndex){
        let ytdValueForCalcs = 0;
        const annualBlockValue = allBlocks[annualIndex].val;
        for(let i = annualIndex; i > 0; i--){
            const block = allBlocks[i];
            if(this.isBlockRefferingToQuarter(block)){
                ytdValueForCalcs = allBlocks[i - 1].val;
                break;
            }
        }
        return annualBlockValue - ytdValueForCalcs;
    }

    static #validateQuarterData(data){
        if (data.length == 0){
            throw new Error("no data is available in the quarter data");
        }
        if(!this.#doesDataIncludeAllQuarters(data)){
            throw new Error("data does not include all quarters");
        }
    }
    
    static #doesDataIncludeAllQuarters(data) {
        for(let i = 0; i < 4; i++){
            if (data[i] == undefined){
                return false;
            }
        }
        return true;
    }
}

module.exports = APIResponseQuarterProcessor;