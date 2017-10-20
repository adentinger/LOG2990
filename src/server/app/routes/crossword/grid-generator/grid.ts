import { Word } from './word';
import { GridFiller } from './grid-filler';

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
