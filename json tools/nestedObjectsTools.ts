

function getSectionsOnlyObjectFromJson(jsonObj){
    let result = {};
    for(const key in jsonObj){
        if (typeof jsonObj[key] == "object"){
            result[key] = getSectionsOnlyObjectFromJson(jsonObj[key]);
        }
    }
    return result;
}

function getObjectWithoutSections(obj){
    let result = {};
    for(const key in obj){
        if (typeof obj[key] == "object" && !Array.isArray(obj[key])){
            const sectionRawValues = getObjectWithoutSections(obj[key]);
            // @ts-ignore
            for (const rawKey in sectionRawValues){
                result[rawKey] = sectionRawValues[rawKey]; 
            }
        } else {
            result[key] = obj[key];
        }
    }
    return result;
}

export = {getSectionsOnlyObjectFromJson, getObjectWithoutSections};