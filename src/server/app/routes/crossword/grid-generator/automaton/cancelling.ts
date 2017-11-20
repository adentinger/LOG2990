import { State, GenerationParameters } from './state';
import { Stopped } from './stopped';

declare class CancellingGenerationRequested extends State {
    public generationParameters: GenerationParameters;
    public generation(parameters: GenerationParameters): State;
    public cancellation(): State;
    public done(): State;
    public shouldGenerationBeRunning(): boolean;
}

export class Cancelling extends State {

    public generation(parameters: GenerationParameters): State {
        return new CancellingGenerationRequested();
    }

    public cancellation(): State {
        return new Cancelling();
    }

    public done(): State {
        return new Stopped();
    }

    public shouldGenerationBeRunning(): boolean {
        return false;
    }

    public get generationParameters(): GenerationParameters {
        throw new Error('Requesting generation parameters while in Cancelling state.');
    }

}
