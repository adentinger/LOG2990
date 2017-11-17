import { Word } from './word';
import { GridFiller } from './grid-filler';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';

export class Grid {

    public static readonly DIMENSIONS = 10;

    public across: Word[] = [];
    public vertical: Word[] = [];

    public async fillUsing(filler: GridFiller): Promise<void> {
        await filler.fill(this);
    }

    public doesWordAlreadyExist(word: string): boolean {
        return this.across.findIndex((acrossWord) => acrossWord.value === word) >= 0 ||
               this.vertical.findIndex((verticalWord) => verticalWord.value === word) >= 0;
    }

    public toGridWords(): GridWord[] {
        const HORIZONTAL_WORDS: GridWord[] =
            this.across.map(
                (word, index) =>
                    new GridWord(
                        index + 1,
                        word.position.row,
                        word.position.column,
                        word.value.length,
                        Direction.horizontal,
                        Owner.none,
                        word.value
                    )
            );
        const VERTICAL_WORDS: GridWord[] =
            this.vertical.map(
                (word, index) =>
                    new GridWord(
                        index + 1,
                        word.position.row,
                        word.position.column,
                        word.value.length,
                        Direction.vertical,
                        Owner.none,
                        word.value
                    )
            );

        return HORIZONTAL_WORDS.concat(VERTICAL_WORDS);
    }

    public toString(): string {
        const DATA: string[][] = [];

        // Fill DATA to be DIMENSIONS x DIMENSIONS
        for (let i = 0; i < Grid.DIMENSIONS; ++i) {
            DATA.push([]);
            for (let j = 0; j < Grid.DIMENSIONS; ++j) {
                DATA[i].push('');
            }
        }

        // Populate DATA with characters of all words
        this.across.forEach((word) => {
            for (let i = 0; i < word.value.length; ++i) {
                const ROW = word.position.row;
                const COLUMN = word.position.column + i;
                DATA[ROW][COLUMN] = word.value.charAt(i);
            }
        });
        this.vertical.forEach((word) => {
            for (let i = 0; i < word.value.length; ++i) {
                const ROW = word.position.row + i;
                const COLUMN = word.position.column;
                DATA[ROW][COLUMN] = word.value.charAt(i);
            }
        });

        // Produce string
        let string = '';
        DATA.forEach((line, lineIndex) => {
            if (lineIndex !== 0) {
                string += '\n';
            }
            line.forEach((character, columnIndex) => {
                if (columnIndex !== 0) {
                    string += ' ';
                }
                if (character !== '') {
                    string += character;
                }
                else {
                    string += '-';
                }
            });
        });

        return string;
    }

}
