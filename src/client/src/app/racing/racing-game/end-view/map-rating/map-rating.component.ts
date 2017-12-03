import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BestTimeComponent } from '../best-time/best-time.component';
import { RenderableMap } from '../../racing-game-map/renderable-map';
import { EndViewComponent } from '../end-view.component';
import { EndViewService } from '../../../services/end-view.service';

@Component({
    selector: 'app-map-rating',
    templateUrl: './map-rating.component.html',
    styleUrls: ['./map-rating.component.css']
})

export class MapRatingComponent {

    private readonly NUMBER_OF_STARS = 5;
    private readonly FILLED_STAR_URL = '/assets/racing/stars-rating/filled-star.png';
    private readonly EMPTY_STAR_URL = '/assets/racing/stars-rating/empty-star.png';
    public stars: string[] = [];
    private indexOfStarClicked;

    constructor(private endViewService: EndViewService) {
        for (let i = 0 ; i < this.NUMBER_OF_STARS ; i++) {
            this.stars.push(this.EMPTY_STAR_URL);
        }
     }

    private mouseHoverStar(indexOfStar: number): void {
        this.stars.fill(this.EMPTY_STAR_URL);
        for (let i = 0 ; i <= indexOfStar; i++) {
            this.stars[i] = this.FILLED_STAR_URL;
        }
    }

    private mouseOutOfStar(): void {
        this.stars.fill(this.EMPTY_STAR_URL);
        if (this.indexOfStarClicked >= 0 && this.indexOfStarClicked !== null) {
            for (let i = 0 ; i <= this.indexOfStarClicked; i++) {
                this.stars[i] = this.FILLED_STAR_URL;
            }
        }
    }

    private clickOnStar(indexOfStar: number) {
        this.indexOfStarClicked = indexOfStar;
    }

    private displayBestTimeComponent(): void {
        this.endViewService.saveMapRating(this.indexOfStarClicked + 1);
        this.endViewService.displayGameResult = false;
    }
}
