import StandardConcepts = require('../concepts/standardConcepts.json');

export type Options = {
    financialStatement: keyof typeof StandardConcepts,
    reportingPeriod: "latestQuarters" | "latestQuarter"| "historicalAnnual" | "latestAnnual" | "specificYear" | "ttm"
    year?: number,
}