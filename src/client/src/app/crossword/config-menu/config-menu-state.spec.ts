import { ConfigMenuState } from './config-menu-state';

describe('ConfigMenuState', () => {
    it('should create an instance', () => {
        const validPage: any = { id: 0, name: '', options: [{name: '', nextPage: 2}] };
        expect(ConfigMenuState.fromJson(validPage).length).toEqual(1);

        const validPages: any[] = [{ id: 0, name: '', options: [] }];
        expect(ConfigMenuState.fromJson(validPages).length).toEqual(1);

        const invalidPage: any = { id: -1, name: '', options: [{ name: '', nextPage: -1 }] };
        expect(() => ConfigMenuState.fromJson(invalidPage)).toThrow();

        const invalidPages: any[] = [{ id: -1, name: '', options: [] }];
        expect(() => ConfigMenuState.fromJson(invalidPages)).toThrow();
    });
});
