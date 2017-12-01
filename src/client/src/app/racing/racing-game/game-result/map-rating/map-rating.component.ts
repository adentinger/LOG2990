import { Component, Input, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { RenderableMap } from '../../racing-game-map/renderable-map';

@Component({
    selector: 'app-map-rating',
    templateUrl: './map-rating.component.html',
    styleUrls: ['./map-rating.component.css']
})

export class MapRatingComponent implements OnInit {

    @Input() public map: RenderableMap;
    public displayable;
    private readonly filledStarImageSource = '/assets/racing/stars-rating/filled-star.png';
    private readonly emptyStarImageSource = '/assets/racing/stars-rating/empty-star.png';
    private firstStar = this.emptyStarImageSource;
    private secondStar = this.emptyStarImageSource;
    private thirdStar = this.emptyStarImageSource;
    private fourthStar = this.emptyStarImageSource;
    private fifthStar = this.emptyStarImageSource;
    private stars: string[] = [];

    constructor() {  }

    public ngOnInit(): void {
        this.displayable = true;
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
}

