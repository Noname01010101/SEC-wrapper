import StandardConcepts = require('../../concepts/standardConcepts.json');

export type statementType = Exclude<keyof typeof StandardConcepts, "cashFlow">;