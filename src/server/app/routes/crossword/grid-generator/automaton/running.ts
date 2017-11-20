import { State, GenerationParameters } from './state';
import { Cancelling } from './cancelling';

declare class Stopped extends State {
    public generationParameters: GenerationParameters;
    public generation(parameters: GenerationParameters): State;
    public cancellation(): State;
    public done(): State;
    public shouldGenerationBeRunning(): boolean;
}

export class Running extends State {

    private parameters: GenerationParameters;

    constructor(parameters: GenerationParameters) {
        super();
        this.parameters = parameters;
    }

    public generation(parameters: GenerationParameters): State {
        throw new Error('Requesting generation while in Running state.');
    }

    public cancellation(): State {
        return new Cancelling();
    }

    public done(): State {
        return new Stopped();
    }

    public shouldGenerationBeRunning(): boolean {
        return true;
    }

    public get generationParameters(): GenerationParameters {
        return {
            wordsToInclude: null,
            difficulty: null
        };
    }

}
