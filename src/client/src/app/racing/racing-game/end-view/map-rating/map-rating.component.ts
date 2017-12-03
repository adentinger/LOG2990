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

    private static readonly NUMBER_OF_STARS = 5;
    private static readonly FILLED_STAR_URL = '/assets/racing/stars-rating/filled-star.png';
    private static readonly EMPTY_STAR_URL = '/assets/racing/stars-rating/empty-star.png';
    private stars: string[] = [];
    private indexOfStarClicked;

    constructor(private endViewService: EndViewService) {
        for (let i = 0 ; i < MapRatingComponent.NUMBER_OF_STARS ; i++) {
            this.stars.push(MapRatingComponent.EMPTY_STAR_URL);
        }
     }

    private mouseHoverStar(indexOfStar: number): void {
        this.stars.fill(MapRatingComponent.EMPTY_STAR_URL);
        for (let i = 0 ; i <= indexOfStar; i++) {
            this.stars[i] = MapRatingComponent.FILLED_STAR_URL;
        }
    }

    private mouseOutOfStar(): void {
        this.stars.fill(MapRatingComponent.EMPTY_STAR_URL);
        if (this.indexOfStarClicked >= 0 && this.indexOfStarClicked !== null) {
            for (let i = 0 ; i <= this.indexOfStarClicked; i++) {
                this.stars[i] = MapRatingComponent.FILLED_STAR_URL;
            }
        }
    }

    private clickOnStar(indexOfStar: number): void {
        this.indexOfStarClicked = indexOfStar;
    }

    private displayBestTimeComponent(): void {
        if (this.indexOfStarClicked) {
            this.endViewService.saveMapRating(this.indexOfStarClicked + 1);
        }
        this.endViewService.displayGameResult = false;
    }
}
