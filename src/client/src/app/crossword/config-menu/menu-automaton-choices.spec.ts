import { TestBed, inject } from '@angular/core/testing';

import { MenuAutomatonChoices, CreateOrJoin } from './menu-automaton-choices';
import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';

describe('MenuAutomatonChoices', () => {

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            MenuAutomatonChoices
        ]
    }));

    let menuAutomatonChoices: MenuAutomatonChoices;

    beforeEach(inject([MenuAutomatonChoices], (menuAutomatonChoicesInjected) => {
        menuAutomatonChoices = menuAutomatonChoicesInjected;
    }));

    it('should be created', () => {
        expect(menuAutomatonChoices).toBeTruthy();
        const otherChoices = new MenuAutomatonChoices(
            GameMode.Classic,
            1,
            Difficulty.hard,
            CreateOrJoin.create,
            42
        );
        expect(otherChoices.gameMode).toEqual(GameMode.Classic);
        expect(otherChoices.playerNumber).toEqual(1);
        expect(otherChoices.difficulty).toEqual(Difficulty.hard);
        expect(otherChoices.createOrJoin).toEqual(CreateOrJoin.create);
        expect(otherChoices.chosenGame).toEqual(42);
    });

    it('should create a game configuration', () => {
        const otherChoices = new MenuAutomatonChoices(
            GameMode.Classic,
            1,
            Difficulty.hard,
            CreateOrJoin.create,
            42
        );
        const gameConfiguration = otherChoices.toGameConfiguration();
        expect(gameConfiguration.gameMode).toEqual(GameMode.Classic);
        expect(gameConfiguration.playerNumber).toEqual(1);
        expect(gameConfiguration.difficulty).toEqual(Difficulty.hard);
        expect(gameConfiguration.gameId).toEqual(42);
    });

});
