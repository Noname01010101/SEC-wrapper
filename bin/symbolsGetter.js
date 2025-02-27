"use strict";
const URLConverter = require("../converters/urlConverter");
const cikCodeConverter = require("../converters/cikCodeConverter");
const requestLimit = require("../SEC requirements/rateLimit");
class SymbolsGetter {
    static async getAllSymbolsInSEC() {
        const tickersUrl = URLConverter.getCompanyTickersURL();
        const res = await requestLimit.APIRateLimitedFetch(tickersUrl);
        if (res.ok) {
            return await this.#getSymbolsFromResponse(res);
        }
        else {
            throw new Error('response trying to get all available symbols is not ok');
        }
    }
    static async #getSymbolsFromResponse(response) {
        const json = await response.json();
        let symbols = [];
        for (const key in json) {
            symbols.push(json[key]["ticker"]);
        }
        return symbols;
    }
    static async getAllCikCodesInSEC() {
        const tickersUrl = URLConverter.getCompanyTickersURL();
        const res = await requestLimit.APIRateLimitedFetch(tickersUrl);
        if (res.ok) {
            return await this.#getCikCodesFromResponse(res);
        }
        else {
            throw new Error('response trying to get all available cik codes is not ok');
        }
    }
    static async #getCikCodesFromResponse(response) {
        const json = await response.json();
        let cik = [];
        for (const key in json) {
            const rawCik = json[key]["cik_str"];
            const fullCik = cikCodeConverter.normalizeCikCode(rawCik);
            cik.push(fullCik);
        }
        return cik;
    }
}
module.exports = SymbolsGetter;
