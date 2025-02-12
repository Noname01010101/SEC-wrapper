

class URLConverter {
    static getConceptURL(cikCode, concept){
        const url = `https://data.sec.gov/api/xbrl/companyconcept/CIK${cikCode}/us-gaap/${concept}.json`;
        return url;
    }

    static getCompanyFactsUrl(cikCode){
        const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cikCode}.json`;
        return url;
    }

    static getSubmissionsUrl(cikCode){
        const url = `https://data.sec.gov/submissions/CIK${cikCode}.json`;
        return url;
    }
}

module.exports = URLConverter;