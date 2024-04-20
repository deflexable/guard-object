

interface FootPrintSignal<PassValue> {
    UNDEFINED: PassValue;
    NULL: PassValue;
    STRING: PassValue;
    BOOLEAN: PassValue;
    ARRAY: PassValue;
    REGEX: PassValue;
    OBJECT: PassValue;
    NUMBER: PassValue;
    INTEGER: PassValue;
    NAN: PassValue;
    WHOLE_NUMBER: PassValue;
    WHOLE_POSITIVE_NUMBER: PassValue;
    WHOLE_NEGATIVE_NUMBER: PassValue;
    DECIMAL: PassValue;
    POSITIVE_DECIMAL: PassValue;
    NEGATIVE_DECIMAL: PassValue;
    LINK: PassValue;
    HTTPS: PassValue;
    HTTP: PassValue;
    FTP: PassValue;
    EMAIL: PassValue;
    PHONE: PassValue;
    PHONE_STRICT: PassValue;
    CARDS: {
        CREDIT_CARD: PassValue;
        CREDIT_CARD_STRICT: PassValue;
        VISA: PassValue;
        VISA_STRICT: PassValue;
        MASTERCARD: PassValue;
        MASTERCARD_STRICT: PassValue;
        AMERICA_EXPRESS: PassValue;
        AMERICA_EXPRESS_STRICT: PassValue;
        DISCOVER: PassValue;
        DISCOVER_STRICT: PassValue
    },
    IP_ADDRESS: {
        GENERAL: PassValue;
        IP_V4: PassValue;
        IP_V6: PassValue;
        MAC_ADDRESS: PassValue
    },
    COORDINATE: {
        LATITUDE_STRING: PassValue;
        LONGITUDE_STRING: PassValue;
        LATITUDE_INT: PassValue;
        LONGITUDE_INT: PassValue;
        LAT_LNG_STRING_ARRAY: PassValue;
        LAT_LNG_INT: PassValue;
        LAT_LNG_STRING: PassValue
    },
    VERSION: PassValue;
    FULLNAME: PassValue;
    DATES: {
        ALL: PassValue;
        OF_EPOCH: PassValue;
        OF_STRING: PassValue;
        ['YYYY-MM-DD']: PassValue;
        ['MM/DD/YYYY']: PassValue;
        ['DD/MM/YYYY']: PassValue;
        ['YYYY/MM/DD']: PassValue;
        ['MM-DD-YYYY']: PassValue;
        ['DD-MM-YYYY']: PassValue;
        ['YYYY/MM/DD HH:MM:SS']: PassValue;
        ['YYYY/MM/DD HH:MM']: PassValue;
        ['MM/DD/YYYY HH:MM:SS AM/PM']: PassValue;
        ['MM/DD/YYYY HH:MM AM/PM']: PassValue;
        ['MM/DD/YYYY 24:MM']: PassValue;
    }
}

declare type executor = () => boolean;

interface FootPrintObject {
    [key: string]: FootPrint;
}

type CustomValidator = () => boolean;
type FootPrint = Symbol | CustomValidator | string | number | ArrayFootPrint | FootPrint[] | FootPrintObject;
type GuardedObject = any;

class ArrayFootPrint {
    constructor(footprint: FootPrint): void;
}

export interface GuardSignal extends FootPrintSignal<Symbol> { };
export interface Validator extends FootPrintSignal<executor> { }

export function guardArray(footprint: FootPrint): ArrayFootPrint;

interface ValidateObject {
    validate: (object: GuardedObject) => void;
}
export function guardObject(footprint: FootPrint): void;