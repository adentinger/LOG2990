import { TestBed, inject } from '@angular/core/testing';
import { DecorationGenerator } from './decoration-generator';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { EventManager } from '@angular/platform-browser/src/dom/events/event_manager';
import { MockMaps } from '../../../admin-screen/map-editor/mock-maps';
import { Decoration } from '../models/decoration/decoration';


describe('Decoration generator', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockMaps
            ]
        });
    });

    let decorationGenerator: DecorationGenerator;
    let mockMaps: MockMaps;

    beforeEach(inject([MockMaps],
        (mockMapFactory: MockMaps) => {
            mockMaps = mockMapFactory;
            decorationGenerator = new DecorationGenerator();
        }));

    it('Should be created', () => {
        expect(DecorationGenerator).toBeTruthy();
    });

    it('Should add decorations on map', () => {
        const map = mockMaps.renderableMap();
        expect(map).toContain(Decoration);
    });

    it('Should not have superposed decorations', () => {
        const map = mockMaps.renderableMap();
        map.children.forEach((children) => {
        });
    });
});
