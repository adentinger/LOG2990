import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Logger } from '../../../../../common/src/logger';
import { SoundEmiter } from '../racing-game/sound/sound-emiter';
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
    public readonly waitToLoad: Promise<void>;

    constructor() {
        this.ambientAudio.setLoop(false);
        this.ambientAudio.setVolume(10);
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

    public setAbmiantSound(soundIndex: Sound): void {
        this.stopAmbiantSound();
        logger.debug('Buffer requested');
        SoundService.SOUND_PROMISES[soundIndex].then((buffer: THREE.AudioBuffer) => {
            this.ambientAudio.setBuffer(buffer);
            this.ambientAudio.play();
            logger.debug('Buffer set', buffer, this.ambientAudio);
        });
    }

    public playAmbiantSound(looping: boolean = false): void {
        if (this.ambientAudio.isPlaying) {
            this.stopAmbiantSound();
        }
        this.ambientAudio.setLoop(looping);
        this.ambientAudio.play();
        this.ambientAudio.autoplay = true;
    }

    public stopAmbiantSound(): void {
        if (this.ambientAudio.isPlaying) {
            this.ambientAudio.autoplay = false;
            this.ambientAudio.stop();
        }
    }

    public registerEmiter(emiter: SoundEmiter): void {
        const sounds: [Sound, SoundType][] = [];
        if (emiter.eventSounds != null && emiter.eventAudios != null) {
            this.populateAudiosWithSounds('event', emiter.eventSounds, emiter.eventAudios);
            if ('onAudioSet' in emiter) {
                for (const [sound, audio] of emiter.eventAudios.entries()) {
                    emiter.onAudioSet(sound, audio);
                }
            }
        }
        if (emiter.constantSounds != null && emiter.constantAudios != null) {
            this.populateAudiosWithSounds('constant', emiter.constantSounds, emiter.constantAudios);
            if ('onAudioSet' in emiter) {
                for (const [sound, audio] of emiter.constantAudios.entries()) {
                    emiter.onAudioSet(sound, audio);
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
            audio.play();
        }, logger.error);
    }

    private registerListener(objectListening: SoundListener): void {
        objectListening.listener.add(SoundService.AUDIO_LISTENER);
    }
}
