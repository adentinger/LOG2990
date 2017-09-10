import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordComponent } from './components/crossword/crossword.component';
import { ConfigMenuComponent } from './components/crossword/config-menu/config-menu.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CrosswordComponent,
        ConfigMenuComponent
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule { }
