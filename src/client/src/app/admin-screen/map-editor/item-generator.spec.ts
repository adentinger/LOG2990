import { TestBed, inject } from '@angular/core/testing';
import { ItemGenerator } from './item-generator';
import { MockMaps } from './mock-maps';
import { Pothole } from './pothole';
import { SpeedBoost } from './speed-boost';

describe('Item generator', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockMaps
            ]
        });
    });

    const itemGenerator = new ItemGenerator();
    let mockMaps: MockMaps;

    beforeEach(inject([MockMaps],
        (mockMapFactory: MockMaps) => {
        mockMaps = mockMapFactory;
    }));

    it('should be created', () => {
        expect(itemGenerator).toBeTruthy();
    });

    it('should add an item', () => {
        const map1 = mockMaps.functionalMap1();
        const map2 = mockMaps.functionalMap2();

        itemGenerator.addItem(Pothole, map2, map1.potholes);
        expect(map2.potholes.length).toEqual(1);

        itemGenerator.addItem(Pothole, map1, map1.potholes);
        expect(map1.potholes.length).toEqual(5);

        itemGenerator.addItem(SpeedBoost, map1, map1.speedBoosts);
        expect(map1.speedBoosts.length).toEqual(0);
    });

});
