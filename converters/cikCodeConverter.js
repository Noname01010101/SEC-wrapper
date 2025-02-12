const APIRateLimitedFetch = require('../SEC requirements/rateLimit').APIRateLimitedFetch;

class CikCodeConverter {
    static async getSymbolCikCodeWithoutCIKKeyword(symbol){
        const url = "https://www.sec.gov/files/company_tickers.json";
        const response = await APIRateLimitedFetch(url);
        if (!response.ok){
            throw new Error(`erorr making request to API: ${response.status}`);
        }
        const data = await response.json();

        const upperSymbol = symbol.toUpperCase();

        for (const key in data) {
            if (data[key].ticker === upperSymbol) {
                return CikCodeConverter.normalizeCikCode(data[key].cik_str);
            }
        }

        throw new Error(`Symbol '${symbol}' not found in SEC data.`);
    }

    static normalizeCikCode(rawCode){
        return rawCode.toString().padStart(10, '0');
    }
}

module.exports = CikCodeConverter;