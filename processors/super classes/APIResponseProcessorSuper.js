

class APIResponseProcessorSuper {
    static getAllBlocks(resJSON){
        if (resJSON['units']['USD'] != undefined){
            return resJSON['units']['USD'];
        } else {
            return resJSON['units']['USD/shares'];
        }
    }

    static isBlockCoveringFullYear(block){
        if (block["frame"]?.length == 6){
            return true;
        } else if (block["frame"]?.includes('I')){
            if(block["frame"].includes('Q4')){
                return true;
            }
        }
        return false;
    }

    static isBlockCoveringAQuarter(block){
        if (block["frame"]?.length == 8 && block["frame"]?.split('Q').length == 2){
            return true;
        } else if (block["frame"]?.length == 9 && block["frame"]?.split('Q').length == 2){
            return true;
        }

        return false;
    }

    static isBlockCoveringSpecificYearQuarter(block, year){
        if (this.isBlockCoveringAQuarter(block)){
            const splitInfo = block["frame"]?.split('Q');
            const blockYear = +splitInfo[0];
            return blockYear == year
        } else {
            return false;
        }
    }
}

module.exports = APIResponseProcessorSuper;