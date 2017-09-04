import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordGameComponent } from './crossword-game.component'

@NgModule({
    imports: [CommonModule],
    declarations: [CrosswordGameComponent],
    exports: [CrosswordGameComponent]
})
export class CrosswordGameModule {}
