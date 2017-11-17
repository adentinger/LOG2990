import { Difficulty as EnumDifficulty } from '../../../../../common/src/crossword/crossword-enums';
import { Difficulty as StateDifficulty } from '../../../../../common/src/crossword/difficulty';
import { DifficultyEasy } from '../../../../../common/src/crossword/difficulty-easy';
import { DifficultyNormal } from '../../../../../common/src/crossword/difficulty-normal';
import { DifficultyHard } from '../../../../../common/src/crossword/difficulty-hard';

export function enumDifficultyToStateDifficulty(difficulty: EnumDifficulty): StateDifficulty {
    switch (difficulty) {
        case EnumDifficulty.easy: return new DifficultyEasy();
        case EnumDifficulty.medium: return new DifficultyNormal();
        case EnumDifficulty.hard: return new DifficultyHard();
        default: throw new Error(`Unknown difficulty: ${difficulty}`);
    }
}
