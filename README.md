# guard-object

Quickly validate your object scheme without breaking a sweat

# Key Advantages

- ⚡️ Superfast (an error is thrown by default when a testCase doesn't match the footprint instead of scanning through the entire testCase)
- 🏋️ Zero Dependency
- 🤸‍♂️ Flexible
- 💪 Validate deep nested objects and arrays

## Installation

```sh
npm install guard-object
```

or using yarn

```sh
yarn add guard-object
```

## Keywords
- `testCase`: this is the data you are validating
- `footprint`: this is the schema used for validating your data

## Basic Usage

```js
import { guardObject, GuardSignal } from 'guard-object';

const schema = guardObject({
    // provide a function for custom validation
    username: value => typeof value === 'string' && value.length < 30,
    // must be a string
    password: GuardSignal.STRING,
    // must match a valid email pattern
    email: GuardSignal.EMAIL,
    // must be an epoch integar
    joinedOn: GuardSignal.DATES.OF_EPOCH
    // must be a valid https link
    photo: GuardSignal.HTTPS,
    location: {
        address: GuardSignal.STRING,
        // must be a valid coordinate in the format [lat, lng]
        coordinate: GuardSignal.COORDINATE.LAT_LNG_INT
    },
    static_field: 7
});

// validation will pass as the testCase matches the footprint 
schema.validate({
    username: 'Jackie Chan',
    password: 'strong_password',
    email: 'jackie.chan@brainbehindx.com',
    joinedOn: 1713634539425,
    photo: 'https://brainbehindx.com/jackie_chan/photo.png',
    location: {
        address: 'Sango ota, ogun state Nigeria',
        coordinate: [6.707728, 3.256003]
    },
    static_field: 7
});

// this will throw an error as the testCase does not match the footprint 
schema.validate({
    username: 'Jackie Chan',
    password: 'strong_password',
    email: 'jackie.chan@brainbehindx.com',
    // should be an integer epoch time
    joinedOn: 'Sat Apr 20 2024 18:43:55',
    photo: 'https://brainbehindx.com/jackie_chan/photo.png',
    // this field shouldn't be here
    unknown_field: 'this is an unknown field',
    location: {
        address: 'Sango ota, ogun state Nigeria'
        // coordinate not provided
    },
    // should be 7
    static_field: 5
});

```

## Validator
all validators are expose so you can reuse them on the fly

```js
import { Validator } from 'guard-object';

Validator.EMAIL('hello@brainbehindx.com'); // true

Validator.CARDS.VISA('3748 8282 9283 2939'); // false
```

## dynamic array
to retain the flexibility in validating testCase, guard-object validate it testCase in a literal way.
Therefore, the following applies

```js
import { guardObject, GuardSignal } from 'guard-object';

const scheme = guardObject({
    history: [
        { profit: GuardSignal.NUMBER, date: GuardSignal.DATES['DD-MM-YYYY'] },
        { profit: GuardSignal.NUMBER, date: GuardSignal.DATES['DD-MM-YYYY'] },
        { profit: GuardSignal.NUMBER, date: GuardSignal.DATES['DD-MM-YYYY'] } 
    ]
});

// validation will pass as each field item matches the footprint
scheme.validate({
    history: [
        { profit: 259, date: '14-04-2024' },
        { profit: 345, date: '15-04-2024' },
        { profit: 134, date: '16-04-2024' } 
    ]
});

// validation will fail as the numbers of item in "history" field doesn't match the footprint
scheme.validate({
    history: [
        { profit: 259, date: '14-04-2024' },
        { profit: 345, date: '15-04-2024' }
    ]
});
```

to validate array dynamically when the length of an array is unknown
```js
import { guardObject, GuardSignal, guardArray } from 'guard-object';

const scheme = guardObject({
    history: guardArray({
        profit: GuardSignal.NUMBER,
        date: GuardSignal.DATES['DD-MM-YYYY']
    })
});

// validation will pass
scheme.validate({
    history: [
        { profit: 259, date: '14-04-2024' },
        { profit: 345, date: '15-04-2024' },
        { profit: 134, date: '16-04-2024' } 
    ]
});

// validation will pass
scheme.validate({
    history: [
        { profit: 259, date: '14-04-2024' },
        { profit: 345, date: '15-04-2024' }
    ]
});

// validation will fail as balance wasn't provided in the footprint
scheme.validate({
    history: [
        { profit: 259, balance: 345, date: '14-04-2024' }
    ]
});
```

## Entity validation
you can also directly validate non-object like:

```js
import { guardObject, GuardSignal, guardArray } from 'guard-object';

// validating number
guardObject(GuardSignal.NUMBER).validate(57);

// validating email
guardObject(GuardSignal.EMAIL).validate('hello@brainbehindx.com');

// validating dynamic array
guardObject(guardArray({
    name: GuardSignal.STRING,
    age: GuardSignal.NUMBER
})).validate([
    { name: 'Albert Einstein', age: 76 },
    { name: 'Jackie Chan', age: 85 }
]);

// e.t.c...
```

## TODO
- Option to enable throwing more refine error