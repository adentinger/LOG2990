import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Logger } from '../../../../../common/src/logger';
import { SoundEmitter } from '../racing-game/sound/sound-emitter';
import { SoundListener } from '../racing-game/sound/sound-listener';
import { Loadable } from '../../loadable';

const logger = Logger.getLogger('Sound');

export type SoundType = 'event' | 'constant';

export enum Sound {
    TETRIS,
    CAR_ENGINE,
    COUNT // The number of sounds
}

@Injectable()
export class SoundService implements Loadable {

    private static readonly URL_PREFIX = '/assets/racing/sounds/';
    private static readonly SOUNDS = [
        'tetris.ogg',
        'car-engine.ogg'
    ];
    private static readonly SOUND_LOADER = new THREE.AudioLoader();
    private static readonly AUDIO_LISTENER = new THREE.AudioListener();

    private static readonly SOUND_PROMISES =
        SoundService.loadSounds(...SoundService.SOUNDS.map((sound) => SoundService.URL_PREFIX + sound));

    private readonly ambientAudio: THREE.Audio = new THREE.Audio(SoundService.AUDIO_LISTENER);
    private readonly registeredEmitters: Set<SoundEmitter> = new Set();
    private registeredListener: SoundListener;

    public readonly waitToLoad: Promise<void>;

    constructor() {
        this.ambientAudio.setLoop(false);
        this.ambientAudio.setVolume(0);
        this.ambientAudio.autoplay = false;
        this.waitToLoad = Promise.all(SoundService.SOUND_PROMISES).then(() => { });
    }

    private static loadSound(url: string): Promise<THREE.AudioBuffer> {
        return new Promise((resolve, reject) => {
            logger.info('Fetching', url);
            SoundService.SOUND_LOADER.load(url, resolve, () => { }, reject);
        });
    }

    private static loadSounds(...urls: string[]): Promise<THREE.AudioBuffer>[] {
        const soundPromises: Promise<THREE.AudioBuffer>[] = [];
        for (const url of urls) {
            soundPromises.push(SoundService.loadSound(url));
        }
        return soundPromises;
    }

    public initialize(listener: SoundListener): void {
        this.registerListener(listener);
    }

    public finalize(): void {
        this.stopAmbiantSound();
        this.registeredEmitters.forEach((emitter: SoundEmitter) => {
            if (emitter.eventAudios != null) {
                emitter.eventAudios.forEach((audio) => audio.stop());
                emitter.eventAudios.clear();
            }
            if (emitter.constantAudios != null) {
                emitter.constantAudios.forEach((audio) => audio.stop());
                emitter.constantAudios.clear();
            }
        });
        this.registeredEmitters.clear();

        if ('onListenerRemove' in this.registeredListener) {
            this.registeredListener.onListenerRemove(SoundService.AUDIO_LISTENER);
        }
        delete this.registeredListener.listener;
    }

    public setAbmiantSound(soundIndex: Sound): void {
        this.stopAmbiantSound();
        SoundService.SOUND_PROMISES[soundIndex].then((buffer: THREE.AudioBuffer) => {
            this.ambientAudio.setBuffer(buffer);
        });
    }

    public playAmbiantSound(looping: boolean = false): void {
        this.stopAmbiantSound();
        this.ambientAudio.setLoop(looping);
        this.ambientAudio.play();
        this.ambientAudio.setVolume(1);
    }

    public stopAmbiantSound(): void {
        if (this.ambientAudio.isPlaying) {
            this.ambientAudio.stop();
        }
    }

    public registerEmitter(emitter: SoundEmitter): void {
        const sounds: [Sound, SoundType][] = [];
        this.registeredEmitters.add(emitter);
        if (emitter.eventSounds != null && emitter.eventAudios != null) {
            this.populateAudiosWithSounds('event', emitter.eventSounds, emitter.eventAudios);
            if ('onAudioSet' in emitter) {
                for (const [sound, audio] of emitter.eventAudios.entries()) {
                    emitter.onAudioSet(sound, audio);
                }
            }
        }
        if (emitter.constantSounds != null && emitter.constantAudios != null) {
            this.populateAudiosWithSounds('constant', emitter.constantSounds, emitter.constantAudios);
            if ('onAudioSet' in emitter) {
                for (const [sound, audio] of emitter.constantAudios.entries()) {
                    emitter.onAudioSet(sound, audio);
                }
            }
        }
    }

    private populateAudiosWithSounds(soundType: SoundType, sounds: Sound[], audios: Map<Sound, THREE.PositionalAudio>): void {
        if (audios != null && sounds != null) {
            for (const sound of sounds) {
                this.registerAudio(sound, audios, soundType === 'constant');
            }
        }
    }

    private registerAudio(soundIndex: Sound, audios: Map<Sound, THREE.PositionalAudio>, isConstantSound: boolean = false): void {
        if (!audios.has(soundIndex)) {
            audios.set(soundIndex, new THREE.PositionalAudio(SoundService.AUDIO_LISTENER));
        }
        const audio = audios.get(soundIndex);
        audio.setRefDistance(1);
        audio.setLoop(isConstantSound);
        SoundService.SOUND_PROMISES[soundIndex].then((buffer: THREE.AudioBuffer) => {
            audio.setBuffer(buffer);
            audio.setVolume(0);
            audio.play();
        }, logger.error);
    }

    private registerListener(objectListening: SoundListener): void {
        this.registeredListener = objectListening;
        objectListening.listener = SoundService.AUDIO_LISTENER;
        if ('onListenerSet' in objectListening) {
            objectListening.onListenerSet(SoundService.AUDIO_LISTENER);
        }
    }
}
