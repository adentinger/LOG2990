import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordComponent } from './crossword.component';

@NgModule({
    imports: [CommonModule],
    declarations: [CrosswordComponent],
    exports: [CrosswordComponent]
})
export class CrosswordModule {}
