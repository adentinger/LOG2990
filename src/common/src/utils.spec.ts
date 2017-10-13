// import { expect } from 'chai';
const chai = require('chai');
import { isJson } from './utils';

// Used to put a blank space between passing and failing tests in the output
function itSplitTests() {
    it('', (done) => done());
}

// Template for isJson tests
function itShould(passOrFail: 'pass' | 'fail', message: string, ...stringsToTest: string[]) {
    it(`should ${passOrFail} ${message}`, (done) => {
        for (const stringToTest of stringsToTest) {
            const FAIL_MESSAGE = `expected "${stringToTest}" to ${passOrFail}`;
            const TEST_RESULT = isJson(stringToTest) ? 'pass' : 'fail' ;
            chai.expect(TEST_RESULT).to.equals(passOrFail, FAIL_MESSAGE);
        }
        done();
    });
}

function itShouldPass(message: string, ...stringToTest: string[]) { itShould('pass', message, ...stringToTest); }
function itShouldFail(message: string, ...stringToTest: string[]) { itShould('fail', message, ...stringToTest); }

describe('The Utility library', () => {
    describe('has a function "isJson" that', () => {
        itShouldPass('a number', '0', '42', '-21', '3.14159265359');
        itShouldPass('an empty JSON Object string', '{}');
        itShouldPass('an empty JSON Array string', '[]');
        itShouldPass('a JSON Object with a null filed', '{"myNull": null}');
        itShouldPass('a JSON Object with a number field', '{"x": 0}', '{"answer": 21}', '{"budget": -2000}');
        itShouldPass('a JSON Object with a string field', '{"name": "Jon Doe"}');
        itShouldPass('a JSON Object with a boolean field', '{"passes": true}', '{"failes": false}');
        itShouldPass('a JSON Object with an Array field', '{"friends": []}', '{"Homer Simpson": ["Donut", "Donut", "Donut", "..."]}');
        itShouldPass('a nested JSON Object', '{"my":{"beautiful":{"nested":{"object":{}}}}}');
        itShouldPass('a JSON Array that contains null', '[null]', '[null, null, null]');
        itShouldPass('a JSON Array that contains numbers', '[0]', '[-1, 1]', '[42, 10000]');
        itSplitTests(); // Section separation
        itShouldFail('an empty string', '');
        itShouldFail('an a string containing non-matching (square) brackets', '{}}', '[[]');
        itShouldFail('empty Object/Array with commas', '{,}', '[,]', '{,,,,,,,}', '[,,,,,,,]');
        itShouldFail('valid JavaScript (pseudo-)numbers', 'Infinity', '-Infinity', 'NaN');
    });
});
