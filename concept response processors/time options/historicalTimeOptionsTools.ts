
import type { GeneralTimeOptions } from './generalTimeOptions.type'

class TimeOptionsTools {
    static getAllConsecutiveYearsFromTimeOptions(timeOptions: GeneralTimeOptions): Array<string>{
        this.validateTimeOptions(timeOptions);

        const startYear = +timeOptions.startYear;
        const endYear = +timeOptions.endYear;
        let years = [];
        const offset = endYear - startYear;
        for (let i = +timeOptions.startYear; i <= startYear + offset; i++){
            years.push(`${i}`);
        }
        return years;
    }

    static getTimeOptionsWithAddedDefaultValuesIfUndefined(timeOptions: GeneralTimeOptions){
        const newestYear = (new Date()).getFullYear();
        if(timeOptions.endYear == undefined){
            timeOptions.endYear = `${newestYear}`
        }
        return timeOptions;
    }

    static validateTimeOptions(timeOptions: GeneralTimeOptions){
        const currentYear = (new Date()).getFullYear();
        if (+timeOptions.startYear >= +timeOptions.endYear){
            throw new Error('start year is bigger or equal to end year');
        }
        if (timeOptions.startYear.length != 4 || timeOptions.endYear.length != 4){
            throw new Error('invalid years were inputed');
        }
        if(+timeOptions.endYear > currentYear){
            throw new Error('endYear is greater than the most recent possible year');
        }
    }
}

export = TimeOptionsTools;