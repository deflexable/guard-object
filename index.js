
const GuardSignal = Object.freeze({
    UNDEFINED: Symbol('UNDEFINED'),
    NULL: Symbol('NULL'),
    STRING: Symbol('STRING'),
    EMPTY_STRING: Symbol('EMPTY_STRING'),
    NON_EMPTY_STRING: Symbol('NON_EMPTY_STRING'),
    TRIMMED_STRING: Symbol('TRIMMED_STRING'),
    TRIMMED_NON_EMPTY_STRING: Symbol('TRIMMED_NON_EMPTY_STRING'),
    BOOLEAN: Symbol('BOOLEAN'),
    ARRAY: Symbol('ARRAY'),
    REGEX: Symbol('REGEX'),
    OBJECT: Symbol('OBJECT'),
    JSON: Symbol('JSON'),
    TIMESTAMP: Symbol('TIMESTAMP'),
    NUMBER: Symbol('NUMBER'),
    INTEGER: Symbol('INTEGER'),
    NAN: Symbol('NAN'),
    WHOLE_NUMBER: Symbol('WHOLE_NUMBER'),
    POSITIVE_NUMBER: Symbol('POSITIVE_NUMBER'),
    NEGATIVE_NUMBER: Symbol('NEGATIVE_NUMBER'),
    POSITIVE_INTEGER: Symbol('POSITIVE_INTEGER'),
    NEGATIVE_INTEGER: Symbol('NEGATIVE_INTEGER'),
    DECIMAL: Symbol('DECIMAL'),
    POSITIVE_DECIMAL: Symbol('POSITIVE_DECIMAL'),
    NEGATIVE_DECIMAL: Symbol('NEGATIVE_DECIMAL'),
    LINK: Symbol('LINK'),
    HTTPS: Symbol('HTTPS'),
    HTTP: Symbol('HTTP'),
    FTP: Symbol('FTP'),
    EMAIL: Symbol('EMAIL'),
    PHONE: Symbol('PHONE'),
    PHONE_STRICT: Symbol('PHONE_STRICT'),
    CARDS: {
        CREDIT_CARD: Symbol('CARDS'),
        CREDIT_CARD_STRICT: Symbol('CREDIT_CARD_STRICT'),
        VISA: Symbol('VISA'),
        VISA_STRICT: Symbol('VISA_STRICT'),
        MASTERCARD: Symbol('MASTERCARD'),
        MASTERCARD_STRICT: Symbol('MASTERCARD_STRICT'),
        AMERICA_EXPRESS: Symbol('AMERICA_EXPRESS'),
        AMERICA_EXPRESS_STRICT: Symbol('AMERICA_EXPRESS_STRICT'),
        DISCOVER: Symbol('DISCOVER'),
        DISCOVER_STRICT: Symbol('DISCOVER_STRICT')
    },
    IP_ADDRESS: {
        GENERAL: Symbol('GENERAL'),
        IP_V4: Symbol('IP_V4'),
        IP_V6: Symbol('IP_V6'),
        MAC_ADDRESS: Symbol('MAC_ADDRESS')
    },
    COORDINATE: {
        LATITUDE_STRING: Symbol('LATITUDE_STRING'),
        LONGITUDE_STRING: Symbol('LONGITUDE_STRING'),
        LATITUDE_INT: Symbol('LATITUDE_INT'),
        LONGITUDE_INT: Symbol('LONGITUDE_INT'),
        LAT_LNG_STRING_ARRAY: Symbol('LAT_LNG_STRING_ARRAY'),
        LAT_LNG_INT: Symbol('LAT_LNG_INT'),
        LAT_LNG_STRING: Symbol('LAT_LNG_STRING')
    },
    VERSION: Symbol('VERSION'),
    FULLNAME: Symbol('FULLNAME'),
    DATES: {
        ALL: Symbol('ALL'),
        OF_EPOCH: Symbol('OF_EPOCH'),
        OF_STRING: Symbol('OF_STRING'),
        ['YYYY-MM-DD']: Symbol('DATE:YYYY-MM-DD'),
        ['MM/DD/YYYY']: Symbol('DATE:MM/DD/YYYY'),
        ['DD/MM/YYYY']: Symbol('DATE:DD/MM/YYYY'),
        ['YYYY/MM/DD']: Symbol('DATE:YYYY/MM/DD'),
        ['MM-DD-YYYY']: Symbol('DATE:MM-DD-YYYY'),
        ['DD-MM-YYYY']: Symbol('DATE:DD-MM-YYYY'),
        ['YYYY/MM/DD HH:MM:SS']: Symbol('DATE:YYYY/MM/DD HH:MM:SS'),
        ['YYYY/MM/DD HH:MM']: Symbol('DATE:YYYY/MM/DD HH:MM'),
        ['MM/DD/YYYY HH:MM:SS AM/PM']: Symbol('DATE:MM/DD/YYYY HH:MM:SS AM/PM'),
        ['MM/DD/YYYY HH:MM AM/PM']: Symbol('DATE:MM/DD/YYYY HH:MM AM/PM'),
        ['MM/DD/YYYY 24:MM']: Symbol('DATE:MM/DD/YYYY 24:MM')
    }
});

const validateYY_MM_DD = ([year, month, day]) => {
    if (year < 1000 || year > 9999 || month < 1 || month > 12) return false;
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= lastDayOfMonth;
}

const stripCreditCard = (a) => a.split(' ').join('').split('-').join('');

const guardExecutor = {
    [GuardSignal.UNDEFINED]: a => a === undefined,
    [GuardSignal.NULL]: a => a === null,
    [GuardSignal.BOOLEAN]: a => typeof a === 'boolean',
    [GuardSignal.STRING]: a => typeof a === 'string',
    [GuardSignal.TRIMMED_STRING]: a => typeof a === 'string' && !a.startsWith(' ') && !a.endsWith(' '),
    [GuardSignal.TRIMMED_NON_EMPTY_STRING]: a => typeof a === 'string' && !a.startsWith(' ') && !a.endsWith(' ') && !!a,
    [GuardSignal.EMPTY_STRING]: a => typeof a === 'string' && !a,
    [GuardSignal.NON_EMPTY_STRING]: a => typeof a === 'string' && !!a,
    [GuardSignal.REGEX]: a => a instanceof RegExp,
    [GuardSignal.ARRAY]: a => Array.isArray(a),
    [GuardSignal.OBJECT]: a => isObject(a),
    [GuardSignal.JSON]: a => isObject(a) || Array.isArray(a),
    [GuardSignal.TIMESTAMP]: a => guardExecutor[GuardSignal.POSITIVE_INTEGER](a) &&
        new Date(a).toString() !== 'Invalid Date',
    [GuardSignal.NUMBER]: a => typeof a === 'number' && !isNaN(a) && Number.isFinite(a),
    [GuardSignal.INTEGER]: a => Number.isInteger(a),
    [GuardSignal.NAN]: a => isNaN(a),
    [GuardSignal.POSITIVE_NUMBER]: a => guardExecutor[GuardSignal.NUMBER](a) && a >= 0,
    [GuardSignal.NEGATIVE_NUMBER]: a => guardExecutor[GuardSignal.NUMBER](a) && a < 0,
    [GuardSignal.WHOLE_NUMBER]: a => guardExecutor[GuardSignal.INTEGER](a) && a >= 0,
    [GuardSignal.POSITIVE_INTEGER]: a => guardExecutor[GuardSignal.WHOLE_NUMBER](a),
    [GuardSignal.NEGATIVE_INTEGER]: a => guardExecutor[GuardSignal.INTEGER](a) && a < 0,
    [GuardSignal.DECIMAL]: a => guardExecutor[GuardSignal.NUMBER](a) && !Number.isInteger(a),
    [GuardSignal.POSITIVE_DECIMAL]: a => guardExecutor[GuardSignal.DECIMAL](a) && a >= 0,
    [GuardSignal.NEGATIVE_DECIMAL]: a => guardExecutor[GuardSignal.DECIMAL](a) && a < 0,
    [GuardSignal.LINK]: a => /^(https?|ftp):\/\/(localhost|(\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/[^\s]*)?$/.test(a),
    [GuardSignal.HTTPS]: a => /^(https:\/\/)(localhost|(\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/[^\s]*)?$/.test(a),
    [GuardSignal.HTTP]: a => /^(http:\/\/)(localhost|(\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/[^\s]*)?$/.test(a),
    [GuardSignal.FTP]: a => /^(ftp:\/\/)(localhost|(\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/[^\s]*)?$/.test(a),
    [GuardSignal.EMAIL]: a => (
        typeof a === 'string' &&
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(a) &&
        a.length <= 320
    ),
    [GuardSignal.PHONE]: a => {
        if (typeof a !== 'string') return false;
        const strip = a.split(' ').join('').split('-').join('');

        return /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g.test(a) &&
            strip.length > 7 &&
            strip.length < 15;
    },
    [GuardSignal.PHONE_STRICT]: a => {
        if (typeof a !== 'string' || !a.startsWith('+')) return false;
        a = a.substring(1);

        return /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g.test(a) &&
            /^\d+$/.test(a) &&
            a.length > 7 &&
            a.length < 15;
    },
    [GuardSignal.CARDS.CREDIT_CARD_STRICT]: a => {
        const digitsOnly = a;
        if (!/^\d+$/.test(digitsOnly) || digitsOnly.length < 13 || digitsOnly.length > 19) {
            return false;
        }

        // Use the Luhn algorithm to validate the card number
        let sum = 0;
        let doubleUp = false;
        for (let i = digitsOnly.length - 1; i >= 0; i--) {
            let digit = parseInt(digitsOnly.charAt(i));

            if (doubleUp) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            doubleUp = !doubleUp;
        }

        return sum % 10 === 0;
    },
    [GuardSignal.CARDS.CREDIT_CARD]: a => guardExecutor[GuardSignal.CARDS.CREDIT_CARD_STRICT](stripCreditCard(a)),
    [GuardSignal.CARDS.VISA]: a => {
        a = stripCreditCard(a);
        // Visa card numbers start with 4 and are 13 to 16 digits long
        return /^4[0-9]{12}(?:[0-9]{3})?$/.test(a) &&
            guardExecutor[GuardSignal.CARDS.CREDIT_CARD_STRICT](a)
    },
    [GuardSignal.CARDS.VISA_STRICT]: a => (
        /^4[0-9]{12}(?:[0-9]{3})?$/.test(a) &&
        guardExecutor[GuardSignal.CARDS.CREDIT_CARD_STRICT](a)
    ),
    [GuardSignal.CARDS.MASTERCARD]: a => {
        a = stripCreditCard(a);
        // Mastercard numbers start with 51 through 55 and are 16 digits long
        return /^5[1-5][0-9]{14}$/.test(a) &&
            guardExecutor[GuardSignal.CARDS.CREDIT_CARD_STRICT](a)
    },
    [GuardSignal.CARDS.MASTERCARD_STRICT]: a => (
        /^5[1-5][0-9]{14}$/.test(a) &&
        guardExecutor[GuardSignal.CARDS.CREDIT_CARD_STRICT](a)
    ),
    [GuardSignal.CARDS.AMERICA_EXPRESS]: a => {
        a = stripCreditCard(a);
        // American Express numbers start with 34 or 37 and are 15 digits long
        return /^3[47][0-9]{13}$/.test(a) &&
            guardExecutor[GuardSignal.CARDS.CREDIT_CARD_STRICT](a)
    },
    [GuardSignal.CARDS.AMERICA_EXPRESS_STRICT]: a => (
        /^3[47][0-9]{13}$/.test(a) &&
        guardExecutor[GuardSignal.CARDS.CREDIT_CARD_STRICT](a)
    ),
    [GuardSignal.CARDS.DISCOVER]: a => {
        a = stripCreditCard(a);
        // Discover numbers start with 6011, 622126 through 622925, 644 through 649, or 65 and are 16 digits long
        const regex = /^(6011|65|64[4-9]|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[01][0-9]|92[0-5]))[0-9]{12}$/;

        return regex.test(a) &&
            guardExecutor[GuardSignal.CARDS.CREDIT_CARD_STRICT](a)
    },
    [GuardSignal.CARDS.DISCOVER_STRICT]: a => {
        const regex = /^(6011|65|64[4-9]|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[01][0-9]|92[0-5]))[0-9]{12}$/;
        return regex.test(a) &&
            guardExecutor[GuardSignal.CARDS.CREDIT_CARD_STRICT](a)
    },
    [GuardSignal.IP_ADDRESS.GENERAL]: a => {
        const ipRegex = /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
        return ipRegex.test(a);
    },
    [GuardSignal.IP_ADDRESS.IP_V4]: a => {
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipv4Regex.test(a);
    },
    [GuardSignal.IP_ADDRESS.IP_V6]: a => {
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv6Regex.test(a);
    },
    [GuardSignal.IP_ADDRESS.MAC_ADDRESS]: a => /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(a),
    [GuardSignal.COORDINATE.LATITUDE_STRING]: a => /^-?([0-8]?[0-9]|90)(\.\d+)?$/.test(a),
    [GuardSignal.COORDINATE.LONGITUDE_STRING]: a => /^-?((1[0-7]|[0-9]?)[0-9]|180)(\.\d+)?$/.test(a),
    [GuardSignal.COORDINATE.LATITUDE_INT]: a => {
        return guardExecutor[GuardSignal.NUMBER](a) &&
            guardExecutor[GuardSignal.COORDINATE.LATITUDE_STRING](`${a}`);
    },
    [GuardSignal.COORDINATE.LONGITUDE_INT]: a => {
        return guardExecutor[GuardSignal.NUMBER](a) &&
            guardExecutor[GuardSignal.COORDINATE.LONGITUDE_STRING](`${a}`);
    },
    [GuardSignal.COORDINATE.LAT_LNG_INT]: a => {
        return Array.isArray(a) &&
            a.length === 2 &&
            guardExecutor[GuardSignal.NUMBER](a[0]) &&
            guardExecutor[GuardSignal.NUMBER](a[1]) &&
            guardExecutor[GuardSignal.COORDINATE.LATITUDE_STRING](`${a[0]}`) &&
            guardExecutor[GuardSignal.COORDINATE.LONGITUDE_STRING](`${a[1]}`);
    },
    [GuardSignal.COORDINATE.LAT_LNG_STRING_ARRAY]: a => {
        return Array.isArray(a) &&
            a.length === 2 &&
            guardExecutor[GuardSignal.COORDINATE.LATITUDE_STRING](a[0]) &&
            guardExecutor[GuardSignal.COORDINATE.LONGITUDE_STRING](a[1]);
    },
    [GuardSignal.COORDINATE.LAT_LNG_STRING]: a => {
        if (typeof a === 'string') return false;
        a = a.split(',');

        return Array.isArray(a) &&
            a.length === 2 &&
            guardExecutor[GuardSignal.COORDINATE.LATITUDE_STRING](a[0]) &&
            guardExecutor[GuardSignal.COORDINATE.LONGITUDE_STRING](a[1]);
    },
    [GuardSignal.VERSION]: a => /^\d+\.\d+$/.test(a),
    [GuardSignal.FULLNAME]: a => typeof a === 'string' &&
        a.trim().split(' ').length === 2 &&
        a.trim().split(' ').filter(v => v).length === 2 &&
        a.trim().length <= 300,
    [GuardSignal.DATES.ALL]: a => {
        const date = new Date(a);
        return !isNaN(date) && date.toString() !== 'Invalid Date';
    },
    [GuardSignal.DATES.OF_EPOCH]: a => (
        guardExecutor[GuardSignal.DATES.ALL](a) &&
        guardExecutor[GuardSignal.DATES.OF_EPOCH](a)
    ),
    [GuardSignal.DATES.OF_STRING]: a => (
        guardExecutor[GuardSignal.DATES.ALL](a) &&
        guardExecutor[GuardSignal.STRING](a)
    ),
    [GuardSignal.DATES['YYYY-MM-DD']]: a => {
        const [year, month, day] = a.split('-').map(Number);
        return /^\d{4}-\d{2}-\d{2}$/.test(a) && validateYY_MM_DD([year, month, day]);
    },
    [GuardSignal.DATES['MM/DD/YYYY']]: a => {
        const [month, day, year] = a.split('/').map(Number);
        return /^\d{2}\/\d{2}\/\d{4}$/.test(a) && validateYY_MM_DD([year, month, day]);
    },
    [GuardSignal.DATES['DD/MM/YYYY']]: a => {
        const [day, month, year] = a.split('/').map(Number);
        return /^\d{2}\/\d{2}\/\d{4}$/.test(a) && validateYY_MM_DD([year, month, day]);
    },
    [GuardSignal.DATES['YYYY/MM/DD']]: a => {
        const [year, month, day] = a.split('/').map(Number);
        return /^\d{4}-\d{2}-\d{2}$/.test(a) && validateYY_MM_DD([year, month, day]);
    },
    [GuardSignal.DATES['MM-DD-YYYY']]: a => {
        const [month, day, year] = a.split('-').map(Number);
        return /^\d{2}-\d{2}-\d{4}$/.test(a) && validateYY_MM_DD([year, month, day]);
    },
    [GuardSignal.DATES['DD-MM-YYYY']]: a => {
        const [day, month, year] = a.split('-').map(Number);
        return /^\d{2}-\d{2}-\d{4}$/.test(a) && validateYY_MM_DD([year, month, day]);
    },
    [GuardSignal.DATES['YYYY/MM/DD HH:MM:SS']]: dateString => {
        const regex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!regex.test(dateString)) return false;

        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);

        if (year < 1000 || year > 9999 || month < 1 || month > 12) return false;
        if (hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) return false;

        const lastDayOfMonth = new Date(year, month, 0).getDate();
        return day >= 1 && day <= lastDayOfMonth;
    },
    [GuardSignal.DATES['YYYY/MM/DD HH:MM']]: dateString => {
        const regex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/;
        if (!regex.test(dateString)) return false;

        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('/').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);

        if (year < 1000 || year > 9999 || month < 1 || month > 12) return false;
        if (hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) return false;

        const lastDayOfMonth = new Date(year, month, 0).getDate();
        return day >= 1 && day <= lastDayOfMonth;
    },
    [GuardSignal.DATES['MM/DD/YYYY HH:MM:SS AM/PM']]: dateString => {
        const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} (AM|PM)$/;
        if (!regex.test(dateString)) return false;

        const [datePart, timePart] = dateString.split(' ');
        const [month, day, year] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);

        if (year < 1000 || year > 9999 || month < 1 || month > 12) return false;
        if (hours < 1 || hours > 12 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) return false;

        const lastDayOfMonth = new Date(year, month, 0).getDate();
        return day >= 1 && day <= lastDayOfMonth;
    },
    [GuardSignal.DATES['MM/DD/YYYY HH:MM AM/PM']]: dateString => {
        const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} (AM|PM)$/;
        if (!regex.test(dateString)) return false;

        const [datePart, timePart] = dateString.split(' ');
        const [month, day, year] = datePart.split('/').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);

        if (year < 1000 || year > 9999 || month < 1 || month > 12) return false;
        if (hours < 1 || hours > 12 || minutes < 0 || minutes >= 60) return false;

        const lastDayOfMonth = new Date(year, month, 0).getDate();
        return day >= 1 && day <= lastDayOfMonth;
    },
    [GuardSignal.DATES['MM/DD/YYYY 24:MM']]: dateString => {
        const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/;
        if (!regex.test(dateString)) return false;

        const [datePart, timePart] = dateString.split(' ');
        const [month, day, year] = datePart.split('/').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);

        if (year < 1000 || year > 9999 || month < 1 || month > 12) return false;
        if (hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) return false;

        const lastDayOfMonth = new Date(year, month, 0).getDate();
        return day >= 1 && day <= lastDayOfMonth;
    }
};

const PreValidator = {};

const spreadValidator = (obj, write) => {
    Object.entries(obj).forEach(([k, v]) => {
        if (isObject(v)) {
            spreadValidator(v, (write || PreValidator)[k] = {});
        } else if (typeof v === 'symbol') {
            (write || PreValidator)[k] = guardExecutor[v];
        } else throw `unexpected value:"${v}" at "${k}"`;
    });
};

spreadValidator(GuardSignal);

const Validator = Object.freeze(PreValidator);

const stringifySymbol = (o) => typeof o === 'symbol' ? o.toString()
    : Validator.JSON(o) ? JSON.stringify(o)
        : o;

const validateFootPrint = ({
    footprint,
    obj,
    lastPath = [],
    parent,
    parentIndex: thisIndex,
    parallel,
    errorChains,
    ancestorData
}) => {
    const initial = !errorChains;
    if (initial) {
        errorChains = [];
        ancestorData = [footprint, obj];
    }
    const locationName = lastPath.join('.');

    const updateErrorSignal = (error) => {
        const errorSignal = new GuardError({
            location: lastPath,
            description: `Invalid object:"${stringifySymbol(obj)}" for footprint:"${stringifySymbol(footprint)}" at field:"${locationName}"`,
            error: error || (locationName ? `unable to validate field at "${locationName}" with value of "${stringifySymbol(obj)}"` : 'unable to validate value'),
            footprint: ancestorData[0],
            value: ancestorData[1]
        });

        if (parallel) {
            errorChains.push(errorSignal);
        } else throw errorSignal;
    };

    if (footprint instanceof ArrayFootPrint) {
        if (Array.isArray(obj)) {
            obj.forEach((o, i) => {
                validateFootPrint({
                    footprint: footprint.footprint,
                    obj: o,
                    lastPath: [...lastPath, i],
                    parent: obj,
                    parentIndex: i,
                    parallel,
                    errorChains,
                    ancestorData
                });
            });
            if (!obj.length && footprint.filled) {
                updateErrorSignal(`got an empty array${locationName ? ' at "' + locationName + '"' : ''}`);
            }
        } else updateErrorSignal(`expected an array${locationName ? ' at "' + locationName + '"' : ''} but got "${stringifySymbol(obj)}"`);
    } else if (typeof footprint === 'function') {
        if (!footprint(obj, parent, thisIndex)) {
            updateErrorSignal();
        }
    } else if (Array.isArray(footprint)) {
        if (!Array.isArray(obj)) {
            updateErrorSignal(`expected an array${locationName ? ' at "' + locationName + '"' : ''} but got "${stringifySymbol(obj)}"`);
            return;
        } else if (obj.length !== footprint.length) {
            const s1 = footprint.length > 1 ? 's' : '';
            const s2 = ob.length > 1 ? 's' : '';
            updateErrorSignal(`expected an array with ${footprint.length} item${s1} but instead got an array with ${obj.length} item${s2}`);
            return;
        }
        obj.forEach((o, i) => {
            validateFootPrint({
                footprint: footprint[i],
                obj: o,
                lastPath: [...lastPath, i],
                parent: obj,
                parentIndex: i,
                parallel,
                errorChains,
                ancestorData
            });
        });
    } else if (footprint instanceof RegExp) {
        if (!footprint.test(obj)) updateErrorSignal();
    } else if (isObject(footprint)) {
        if (!isObject(obj)) {
            updateErrorSignal(`expected an object${locationName ? ' at "' + locationName + '"' : ''} but got "${stringifySymbol(obj)}"`);
            return;
        }
        Object.entries(footprint).forEach(([node, value]) => {
            if (
                value !== undefined &&
                !([node] in obj) &&
                (typeof value === 'function' ? !value(undefined, obj) : true)
            ) throw `missing field:"${[...lastPath, node].join('.')}"`;
        });
        Object.entries(obj).forEach(([node, value]) => {
            validateFootPrint({
                footprint: footprint[node],
                obj: value,
                lastPath: [...lastPath, node],
                parent: obj,
                parentIndex: thisIndex,
                parallel,
                errorChains,
                ancestorData
            });
        });
    } else if (footprint !== obj && !guardExecutor[footprint]?.(obj))
        updateErrorSignal();

    if (parallel && initial && errorChains.length) {
        throw errorChains;
    }
}

function isObject(o) {
    if (typeof o !== 'object' || o === null) return false;
    return Object.prototype.toString.call(o) === '[object Object]'
        && Object.getPrototypeOf(o) === Object.prototype;
}

class ArrayFootPrint {
    constructor(footprint, filled) {
        this.footprint = footprint;
        this.filled = filled;
    }
}

class GuardError {
    constructor(params) {
        this.args = params;
    }

    match(footprint) {
        // TODO:
    }
    getDescription = () => this.args.description;
    toString = () => this.args.error;
    toJSON = () => this.toString();
}

const guardArray = (footprint) => new ArrayFootPrint(footprint);
const guardFilledArray = (footprint) => new ArrayFootPrint(footprint, true);
const guardObject = (footprint) => ({
    validate: obj => {
        validateFootPrint({ footprint, obj });
        return true;
    }
});

const guardAllObject = () => ({
    validate: obj => {
        validateFootPrint({ footprint, obj, parallel: true });
        return true;
    }
});

const niceGuard = (footprint, testCase) => {
    try {
        guardObject(footprint).validate(testCase);
        return true
    } catch (error) {
        return false;
    }
};

module.exports = {
    Validator,
    GuardSignal,
    GuardError,
    guardAllObject,
    guardFilledArray,
    guardArray,
    guardObject,
    niceGuard
};