import URLConverter = require('../converters/urlConverter');
import cikCodeConverter = require('../converters/cikCodeConverter');

class SymbolsGetter {
    static async getAllSymbolsInSEC(): Promise<string[]>{
        const tickersUrl = URLConverter.getCompanyTickersURL();
        const res = await fetch(tickersUrl);
        if (res.ok){
            return await this.#getSymbolsFromResponse(res);
        } else {
            throw new Error('response trying to get all available symbols is not ok');
        }
    }

    static async #getSymbolsFromResponse(response): Promise<string[]>{
        const json = await response.json();
        let symbols = [];
        for (const key in json){
            symbols.push(json[key]["ticker"]);
        }
        return symbols;
    }

    static async getAllCikCodesInSEC(): Promise<string[]>{
        const tickersUrl = URLConverter.getCompanyTickersURL();
        const res = await fetch(tickersUrl);
        if (res.ok){
            return await this.#getCikCodesFromResponse(res);
        } else {
            throw new Error('response trying to get all available cik codes is not ok');
        }
    }

    static async #getCikCodesFromResponse(response): Promise<string[]>{
        const json = await response.json();
        let cik = [];
        for (const key in json){
            const rawCik = json[key]["cik_str"];
            const fullCik = cikCodeConverter.normalizeCikCode(rawCik);
            cik.push(fullCik);
        }
        return cik;
    }
}

export = SymbolsGetter;