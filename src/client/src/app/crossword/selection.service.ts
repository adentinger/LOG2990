import { Injectable } from '@angular/core';
// import { SelectedWord } from "./class/selected-word";
import { SelectedWord } from '../../../../common/src/crossword/selected-word';

export class SelectionService {
    public selection: SelectedWord = new SelectedWord();
}
