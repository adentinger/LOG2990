import { expect } from 'chai';
import { WordSuggestions } from './word-suggestions';

describe('WordSuggestions', () => {

    it('should be created', () => {
        const WORDS: string[] =
            ['chuck', 'norris', 'is', 'darth', 'vader\'s', 'father'];
        const SUGGESTIONS =
            new WordSuggestions(WORDS);
        expect(SUGGESTIONS).to.be.ok;
        expect(SUGGESTIONS.length).to.equal(WORDS.length);
    });

    describe('randomSuggestion', () => {

        it('should get a random suggestion', () => {
            const WORDS = ['hello', 'world'];
            const SUGGESTIONS = new WordSuggestions(WORDS);
            expect(WORDS).to.contain(SUGGESTIONS.randomSuggestion);
        });

        it('should throw if there are no suggestions', () => {
            const EMPTY = new WordSuggestions([]);
            expect(() => EMPTY.randomSuggestion).to.throw;
        });

        it('should format the word before returning it', () => {
            const WORDS = ['HÉL\'Lo'];
            const SUGGESTIONS = new WordSuggestions(WORDS);
            expect(SUGGESTIONS.randomSuggestion).to.equal('hello');
        });

    });

});
