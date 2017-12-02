import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BestTimeComponent } from '../best-time/best-time.component';
import { RenderableMap } from '../../racing-game-map/renderable-map';
import { EndViewComponent } from '../end-view.component';

@Component({
    selector: 'app-map-rating',
    templateUrl: './map-rating.component.html',
    styleUrls: ['./map-rating.component.css']
})

export class MapRatingComponent implements OnInit {

    @Input() public map: RenderableMap;
    @ViewChild(BestTimeComponent)
    private bestTime: BestTimeComponent;
    private readonly NUMBER_OF_STARS = 5;
    public displayable;
    private readonly filledStarImageSource = '/assets/racing/stars-rating/filled-star.png';
    private readonly emptyStarImageSource = '/assets/racing/stars-rating/empty-star.png';
    public stars: string[] = [];
    private numberOfStarsClicked;

    constructor(private endView: EndViewComponent) {  }

    public ngOnInit(): void {
        this.displayable = false;
        for (let i = 0 ; i < this.NUMBER_OF_STARS ; i++) {
            this.stars.push(this.emptyStarImageSource);
        }
    }

    public mouseHoverStar(index: number): void {
        this.stars.fill(this.emptyStarImageSource);
        for (let i = 0 ; i <= index; i++) {
            this.stars[i] = this.filledStarImageSource;
        }
    }

    public mouseOutOfStar(): void {
        this.stars.fill(this.emptyStarImageSource);
        if (this.numberOfStarsClicked >= 0 && this.numberOfStarsClicked !== null) {
            for (let i = 0 ; i <=  this.numberOfStarsClicked; i++) {
                this.stars[i] = this.filledStarImageSource;
            }
        }
    }

    public clickOnStar(index: number) {
        this.numberOfStarsClicked = index;
    }

    public displayBestTimeComponent(): void {
        this.endView.displayGameResult = false;
    }
}
