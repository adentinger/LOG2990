import { State, GenerationParameters } from './state';
import { Running } from './running';

export class Stopped extends State {

    public generation(parameters: GenerationParameters): State {
        return new Running();
    }

    public cancellation(): State {
        return new Stopped();
    }

    public done(): State {
        throw new Error('Generation or cancellation done while in Stopped state.');
    }

    public shouldGenerationBeRunning(): boolean {
        return false;
    }

    public get generationParameters(): GenerationParameters {
        throw new Error('Requesting generation parameters while in Stopped state.');
    }

}
