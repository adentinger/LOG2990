import { ConfigMenuState } from './config-menu-state';
import { FetchableOptionList, FetchedPendingGame } from './config-menu-option';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('ConfigMenuState', () => {
    let httpController: HttpTestingController;
    let http: HttpClient;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HttpClient]
        });
        http = TestBed.get(HttpClient);
        httpController = TestBed.get(HttpTestingController);
    });

    it('should create an instance', () => {
        const validPage: any = { id: 0, name: '', options: [{ name: '', nextPage: 2 }] };
        expect(ConfigMenuState.fromJson(validPage, http).length).toEqual(1);

        const validPages: any[] = [{ id: 0, name: '', options: [] }];
        expect(ConfigMenuState.fromJson(validPages, http).length).toEqual(1);

        const invalidPage: any = { id: -1, name: '', options: [{ name: '', nextPage: -1 }] };
        expect(() => ConfigMenuState.fromJson(invalidPage, http)).toThrow();

        const invalidPages: any[] = [{ id: -1, name: '', options: [] }];
        expect(() => ConfigMenuState.fromJson(invalidPages, http)).toThrow();
    });

    it('should be able to tell if it has fetchable options or not', () => {
        const gameListUrl = '/crossword/games/pending/10';
        const fetchableOptions = { url: gameListUrl, nextPage: -1 };
        const pageWithFetchableOptions: any = { id: 0, name: '', options: fetchableOptions };

        const state = ConfigMenuState.fromJson(pageWithFetchableOptions, http)[0];
        expect(state).toBeDefined();
        expect((state.options as FetchableOptionList).fetchedOptions.length).toEqual(0);
        expect(ConfigMenuState.hasFetchableOptions(state)).toBeTruthy();

        const gameList: FetchedPendingGame[] = [
            {player: 'MockPlayer1', mode: 'classic', difficulty: 'easy'},
            {player: 'MockPlayer2', mode: 'dynamic', difficulty: 'normal'}
        ];
        httpController.expectOne(gameListUrl).flush(gameList);

        expect((state.options as FetchableOptionList).fetchedOptions.length).toEqual(2);
    });
});
