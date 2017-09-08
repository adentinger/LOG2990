import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordComponent } from './components/crossword/crossword.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CrosswordComponent
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule {}
