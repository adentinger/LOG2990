import { UserDisplayableGameData } from './user-displayable-game-data';
import { GameMode, Difficulty } from '../../../../../../common/src/crossword/crossword-enums';

const DEFAULT_ID = 0;
const DEFAULT_MODE = GameMode.Classic;
const DEFAULT_DIFFICULTY = Difficulty.easy;

describe('UserDisplayableGameData', () => {

    it('should be created', () => {
        const DATA = new UserDisplayableGameData(DEFAULT_ID, DEFAULT_MODE, DEFAULT_DIFFICULTY);
        expect(DATA).toBeTruthy();
    });

    it('should deserialize game ids', () => {
        const DATA = new UserDisplayableGameData(-42, DEFAULT_MODE, DEFAULT_DIFFICULTY);
        expect(DATA.id).toEqual(-42);
    });

    it('should deserialize game modes', () => {
        const DATA1 = new UserDisplayableGameData(DEFAULT_ID, GameMode.Classic, DEFAULT_DIFFICULTY);
        expect(DATA1.mode).toMatch(/^classic$/i);
        const DATA2 = new UserDisplayableGameData(DEFAULT_ID, GameMode.Dynamic, DEFAULT_DIFFICULTY);
        expect(DATA2.mode).toMatch(/^dynamic$/i);
        console.log('DATA2Mode:', DATA2.mode);
    });

    it('should deserialize game difficulties', () => {
        const DATA1 = new UserDisplayableGameData(DEFAULT_ID, DEFAULT_MODE, Difficulty.easy);
        expect(DATA1.difficulty).toMatch(/^easy$/i);
        const DATA2 = new UserDisplayableGameData(DEFAULT_ID, DEFAULT_MODE, Difficulty.medium);
        expect(DATA2.difficulty).toMatch(/^normal$/i);
        const DATA3 = new UserDisplayableGameData(DEFAULT_ID, DEFAULT_MODE, Difficulty.hard);
        expect(DATA3.difficulty).toMatch(/^hard$/i);
    });

});
