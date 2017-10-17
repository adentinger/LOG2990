export class WordPosition {

    public row: number;
    public column: number;

    public equals(that: WordPosition): boolean {
        return this.row === that.row &&
               this.column === that.column;
    }

}
