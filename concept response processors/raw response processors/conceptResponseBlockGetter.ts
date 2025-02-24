

class ConceptResponseBlockConverter {
    static getExtractedBlocksFromConceptResponse(conceptResponse){
        if (conceptResponse['units']['USD'] != undefined){
            return conceptResponse['units']['USD'];
        } else if (conceptResponse['units']['USD/shares'] != undefined){
            return conceptResponse['units']['USD/shares'];
        } else if (conceptResponse['units']['shares'] != undefined){
            return conceptResponse['units']['shares'];
        }

        throw new Error('Could not get the extracted blocks from the response because no units were found');
    }
}

export = ConceptResponseBlockConverter;