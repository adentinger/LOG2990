import { Component} from '@angular/core';
import { EndViewService, EndGameWindow } from '../../../services/end-view.service';

@Component({
    selector: 'app-map-rating',
    templateUrl: './map-rating.component.html',
    styleUrls: ['./map-rating.component.css']
})

export class MapRatingComponent {

    private static readonly NUMBER_OF_STARS = 5;
    private static readonly FILLED_STAR_URL = '/assets/racing/stars-rating/filled-star.png';
    private static readonly EMPTY_STAR_URL = '/assets/racing/stars-rating/empty-star.png';
    public stars: string[] = [];
    public indexOfStarClicked;

    constructor(private endViewService: EndViewService) {
        for (let i = 0 ; i < MapRatingComponent.NUMBER_OF_STARS ; i++) {
            this.stars.push(MapRatingComponent.EMPTY_STAR_URL);
        }
     }

    public mouseHoverStar(indexOfStar: number): void {
        this.stars.fill(MapRatingComponent.EMPTY_STAR_URL);
        for (let i = 0 ; i <= indexOfStar; i++) {
            this.stars[i] = MapRatingComponent.FILLED_STAR_URL;
        }
    }

    public mouseOutOfStar(): void {
        this.stars.fill(MapRatingComponent.EMPTY_STAR_URL);
        if (this.indexOfStarClicked >= 0 && this.indexOfStarClicked !== null) {
            for (let i = 0 ; i <= this.indexOfStarClicked; i++) {
                this.stars[i] = MapRatingComponent.FILLED_STAR_URL;
            }
        }
    }

    public clickOnStar(indexOfStar: number): void {
        this.indexOfStarClicked = indexOfStar;
    }

    public displayBestTimeComponent(): void {
        if (this.indexOfStarClicked + 1) {
            this.endViewService.updateMapRating(this.indexOfStarClicked + 1);
        }
        this.endViewService.displayGameResult = EndGameWindow.BEST_TIME;
    }
}
