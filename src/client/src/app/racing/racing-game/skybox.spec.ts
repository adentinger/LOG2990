import { TestBed, inject } from '@angular/core/testing';

import { Skybox, SkyboxMode } from './skybox';

describe('Skybox', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Skybox
            ]
        });
    });

    let skybox: Skybox;

    beforeEach(inject([Skybox], (skyboxInjected: Skybox) => {
        skybox = skyboxInjected;
    }));


    it('should be created', () => {
        expect(skybox).toBeTruthy();
    });

    describe('mode', () => {

        it('should change the skybox\'s mode when required.', () => {
            skybox.mode = SkyboxMode.DAY;
            expect(skybox.mode).toEqual(SkyboxMode.DAY);
            skybox.mode = SkyboxMode.NIGHT;
            expect(skybox.mode).toEqual(SkyboxMode.NIGHT);
        });

        it('should not change the skybox\'s mode when it is not valid.', () => {
            const INVALID: number[] = [-1, SkyboxMode.NUMBER_OF_MODES];
            INVALID.forEach((invalid) => {
                expect(() => skybox.mode = invalid).toThrow();
            });
        });

    });

});
