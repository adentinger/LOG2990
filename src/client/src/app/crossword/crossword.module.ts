import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordComponent } from './components/crossword/crossword.component';
import { BoardComponent } from './components/crossword/board/board.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CrosswordComponent,
        BoardComponent
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule {}
