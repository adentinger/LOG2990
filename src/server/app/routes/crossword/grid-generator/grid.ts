import { Word } from '../word';
import { GridFiller } from './grid-filler';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';

export class Grid {

    public static readonly DIMENSIONS = 10;

    public words: Word[] = [];

    public async fillUsing(filler: GridFiller): Promise<void> {
        await filler.fill(this);
    }

    public doesWordAlreadyExist(word: string): boolean {
        return this.words.findIndex((existingWord) => existingWord.value === word) >= 0;
    }

    public toGridWords(): GridWord[] {
        let horizontalId = 1, verticalId = 1;
        return this.words.map(word => {
            let id: number;

            if (word.direction === Direction.horizontal) {
                id = horizontalId++;
            }
            else {
                id = verticalId++;
            }

            return new GridWord(
                id,
                word.position.row,
                word.position.column,
                word.value.length,
                word.direction,
                -1,
                word.value
            );
        });
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
        this.words.forEach((word) => {
            if (word.direction === Direction.horizontal) {
                for (let i = 0; i < word.value.length; ++i) {
                    const ROW = word.position.row;
                    const COLUMN = word.position.column + i;
                    DATA[ROW][COLUMN] = word.value.charAt(i);
                }
            }
            else {
                for (let i = 0; i < word.value.length; ++i) {
                    const ROW = word.position.row + i;
                    const COLUMN = word.position.column;
                    DATA[ROW][COLUMN] = word.value.charAt(i);
                }
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
