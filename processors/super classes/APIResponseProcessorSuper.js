

class APIResponseProcessorSuper {
    static getAllBlocks(resJSON){
        if (resJSON['units']['USD'] != undefined){
            return resJSON['units']['USD'];
        } else {
            return resJSON['units']['USD/shares'];
        }
    }

    static isBlockCoveringFullYear(block){
        return block["frame"]?.length == 6;
    }

    static isBlockCoveringAQuarter(block){
        return block["frame"]?.length == 8 && block["frame"]?.split('Q').length == 2;
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