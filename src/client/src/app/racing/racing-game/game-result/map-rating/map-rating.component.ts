import { Component, Input, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { RenderableMap } from '../../racing-game-map/renderable-map';
import { BestTimeComponent } from '../best-time/best-time.component';

@Component({
    selector: 'app-map-rating',
    templateUrl: './map-rating.component.html',
    styleUrls: ['./map-rating.component.css']
})

export class MapRatingComponent implements OnInit {

    @Input() public map: RenderableMap;
    @ViewChild(BestTimeComponent)
    private bestTime: BestTimeComponent;
    public displayable;
    private readonly filledStarImageSource = '/assets/racing/stars-rating/filled-star.png';
    private readonly emptyStarImageSource = '/assets/racing/stars-rating/empty-star.png';
    public stars: string[] = [];

    constructor() {  }

    public ngOnInit(): void {
        this.displayable = false;
        for (let i = 0 ; i < 5 ; i++) {
            this.stars.push(this.emptyStarImageSource);
        }
    }

    public OnMouseOver(index: number): void {
        for (let i = 0 ; i <= index; i++) {
            this.stars[i] = this.filledStarImageSource;
        }
    }

    public OnMouseOut(): void {
        this.stars.fill(this.emptyStarImageSource);
    }

    public onClick(index: number) {
        console.log('test');
    }

    public displayBestTimeComponent(): void {
        this.bestTime.displayable = true;
        this.displayable = false;
    }
}

