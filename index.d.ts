

interface FootPrintSignal<PassValue> {
    UNDEFINED: PassValue;
    NULL: PassValue;
    STRING: PassValue;
    TRIMMED_STRING: PassValue;
    TRIMMED_NON_EMPTY_STRING: PassValue;
    EMPTY_STRING: PassValue;
    NON_EMPTY_STRING: PassValue;
    BOOLEAN: PassValue;
    ARRAY: PassValue;
    REGEX: PassValue;
    OBJECT: PassValue;
    JSON: PassValue;
    TIMESTAMP: PassValue;
    NUMBER: PassValue;
    INTEGER: PassValue;
    NAN: PassValue;
    POSITIVE_NUMBER: PassValue;
    NEGATIVE_NUMBER: PassValue;
    WHOLE_NUMBER: PassValue;
    POSITIVE_INTEGER: PassValue;
    NEGATIVE_INTEGER: PassValue;
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

declare type executor = (testCase: any) => boolean;

interface FootPrintObject {
    [key: string]: FootPrint;
}

type CustomValidator = (testCase: any, testCaseParent?: any, nearestArrayIndex?: number | undefined) => boolean;
type FootPrint = Symbol | CustomValidator | string | RegExp | number | ArrayFootPrint | FootPrint[] | FootPrintObject;
type GuardedObject = any;

interface GuardParams {
    location: string[];
    description: string;
    footprint: FootPrint;
    value: any;
}

declare class ArrayFootPrint {
    constructor(footprint: FootPrint);
}

export class GuardError {
    constructor(params: GuardParams);

    // match(footprint) {
    //     // TODO:
    // }
    getDescription(): string;
    toString(): string;
    toJSON(): string;
}

interface GuardSignalX extends FootPrintSignal<Symbol> { }
interface ValidatorX extends FootPrintSignal<executor> { }

export const GuardSignal: GuardSignalX;
export const Validator: ValidatorX;
/**
 * represents a footprint against an array
 * 
 * @param footprint the footprint to validate against
 */
export function guardArray(footprint: FootPrint): ArrayFootPrint;
/**
 * represents a footprint against a non-empty array
 * 
 * @param footprint the footprint to validate against
 */
export function guardFilledArray(footprint: FootPrint): ArrayFootPrint;

interface ValidateObject {
    /**
     * 
     * @param object object to validate from the provided footprint schema
     * @returns true if the object was valid or throw an error if it wasn't
     */
    validate: (object: GuardedObject) => true;
}

/**
 * validate a footprint against an object.
 * throws an error if a value doesn't match it's respective footprint
 * 
 * @param footprint the footprint to validate against
 * 
 * @throws {GuardError}
 */
export function guardObject(footprint: FootPrint): ValidateObject;
/**
 * validate a footprint against an object and gather all errors before throwing
 * 
 * @param footprint the footprint to validate against
 * 
 * @throws {GuardError[]}
 */
export function guardAllObject(footprint: FootPrint): ValidateObject;
export function niceGuard(footprint: FootPrint, object: GuardedObject): boolean;