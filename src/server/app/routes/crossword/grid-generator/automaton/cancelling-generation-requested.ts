import { State, GenerationParameters } from './state';
import { Cancelling } from './cancelling';
import { Running } from './running';

export class CancellingGenerationRequested extends State {

    private parameters: GenerationParameters;

    constructor(parameters: GenerationParameters) {
        super();
        this.parameters = parameters;
    }

    public generation(parameters: GenerationParameters): State {
        throw new Error('Generation while in CancellingGenerationRequested state.');
    }

    public cancellation(): State {
        return new Cancelling();
    }

    public done(): State {
        return new Running(this.parameters);
    }

    public shouldGenerationBeRunning(): boolean {
        return false;
    }

    public get generationParameters(): GenerationParameters {
        throw new Error('Requesting generation parameters while in CancellingGenerationRequested state.');
    }

}
