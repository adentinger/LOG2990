import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordComponent } from './components/crossword/crossword.component';
import { BoardComponent } from './components/crossword/board/board.component';
import { DefinitionFieldComponent } from './components/crossword/definition-field/definition-field.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CrosswordComponent,
        BoardComponent,
        DefinitionFieldComponent
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule {}
