const concepts = require('../concepts/standardConcepts.json');

const balanceConcepts = concepts.balance;
const incomeConcepts = concepts.incomeStatement;
const cashFlowConcepts = concepts.cashFlow;
const miscellanousConcepts = concepts.miscellanous;

const StatementMakerSuper = require('./super classes/statementMakerSuper');

class StatementMaker extends StatementMakerSuper{
    constructor(){
        super();
    }
    async getStatementHistory(symbol, options){
        let statementConcepts = this.getStatementConceptsFromType(options.statementType);
        return await super.getHistoricalAnnualStatements(symbol, statementConcepts);
    }

    async getLatestAnnualStatement(symbol, options){
        let statementConcepts = this.getStatementConceptsFromType(options.statementType);
        return await super.getLatestAnnualStatement(symbol, statementConcepts);
    }

    async getSpecificYearStatement(symbol, options){
        let statementConcepts = this.getStatementConceptsFromType(options.statementType);
        return await super.getSpecificYearAnnualStatement(symbol, statementConcepts, options.year);
    }

    async getTTMStatement(symbol, options){
        let statementConcepts = this.getStatementConceptsFromType(options.statementType);
        return await super.getTTMStatement(symbol, statementConcepts);
    }

    async getLatestQuarterStatements(symbol, options){
        let statementConcepts = this.getStatementConceptsFromType(options.statementType);
        return await super.getLatestQuarterStatements(symbol, statementConcepts);
    }

    getStatementConceptsFromType(type){
        if (type == 'income'){
            return incomeConcepts;
        } else if (type == 'balance'){
            return balanceConcepts;
        } else if (type == 'cashFlow'){
            return cashFlowConcepts;
        } else if (type == 'miscellanous'){
            return miscellanousConcepts;
        } else {
            throw new Error('invalid statement type');
        }
    }
}

module.exports = StatementMaker;