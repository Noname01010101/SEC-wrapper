

function getSectionsOnlyObjectFromJson(jsonObj){
    let result = {};
    for(const key in jsonObj){
        if (typeof jsonObj[key] == "object"){
            result[key] = getSectionsOnlyObjectFromJson(jsonObj[key]);
        }
    }
    return result;
}

module.exports = getSectionsOnlyObjectFromJson;