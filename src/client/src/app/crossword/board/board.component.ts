import { Component, OnInit } from '@angular/core';

var CROSSWORD: string[][] =[['T','O','M','O','R','R','O','W','%','O'],
                            ['E','%','E','%','%','I','%','H','%','N'],
                            ['L','A','T','E','%','N','O','I','S','E'],
                            ['E','%','R','%','%','D','%','S','%','%'],
                            ['T','O','M','O','R','R','O','W','%','O'],
                            ['E','%','E','%','%','I','%','H','%','N'],
                            ['L','A','T','E','%','N','O','I','S','E'],
                            ['E','%','R','%','%','D','%','S','%','%'],
                            ['T','O','M','O','R','R','O','W','%','O'],
                            ['E','%','E','%','%','I','%','H','%','N']];

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

    crossword = CROSSWORD;
    constructor() { }

    public ngOnInit(): void {
    }

}
