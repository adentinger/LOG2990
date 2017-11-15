import * as THREE from 'three';
import { Logger } from '../../../../../common/src/logger';
import { SoundEmiter } from '../racing-game/sound/sound-emiter';
import { SoundListener } from '../racing-game/sound/sound-listener';

const logger = Logger.getLogger('Sound');

export class SoundService {

    private static readonly TETRIS_MUSIC = '/assets/racing/sounds/tetris.ogg';
    private static readonly AUDIO_LOADER = new THREE.AudioLoader();
    private static readonly AUDIO_LISTENER = new THREE.AudioListener();
    public readonly waitToLoad: Promise<void>;

    constructor(emiter: SoundEmiter) {
        this.waitToLoad = this.setAudio(emiter);
    }

    private async setAudio(emiter: SoundEmiter): Promise<void> {
        SoundService.AUDIO_LOADER.load(SoundService.TETRIS_MUSIC, (buffer: THREE.AudioBuffer) => {
            emiter.audio.setBuffer(buffer);
            emiter.audio.setRefDistance(100);
            emiter.audio.setLoop(true);
            emiter.audio.play();
        }, () => { }, logger.error);
    }

    public initialise(emiter: SoundEmiter, listener: SoundListener): void {
        this.setAudio(emiter);
        this.registerListener(listener);
        this.registerEmiter(emiter);
    }

    private registerEmiter(emiter: SoundEmiter): void {
        emiter.audio = new THREE.PositionalAudio(SoundService.AUDIO_LISTENER);
    }

    private registerListener(objectListening: SoundListener): void {
        objectListening.listener.add(SoundService.AUDIO_LISTENER);
    }
}
