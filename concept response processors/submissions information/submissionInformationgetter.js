"use strict";
const CikCodeCoverter = require("../../converters/cikCodeConverter");
const URLConverter = require("../../converters/urlConverter");
class SubmissionInfoGetter {
    static async getLatestAnnualReportYear(symbol) {
        const cikCode = await CikCodeCoverter.getSymbolCikCodeWithoutCIKKeyword(symbol);
        const submissionsUrl = URLConverter.getSubmissionsUrl(cikCode);
        const response = await fetch(submissionsUrl);
        const data = await response.json();
        const filings = data.filings.recent;
        // Find the most recent 10-K filing
        for (let i = 0; i < filings.form.length; i++) {
            if (filings.form[i] === "10-K") {
                const latest10KDate = filings.filingDate[i]; // Format: YYYY-MM-DD
                const latest10KYear = latest10KDate.split("-")[0]; // Extract year
                return latest10KYear;
            }
        }
        throw new Error('could not get the the latest 10k report date');
    }
}
module.exports = SubmissionInfoGetter;
