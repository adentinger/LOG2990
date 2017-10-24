import { TestBed, inject } from '@angular/core/testing';
import { ItemGenerator } from './item-generator';
import { MockMaps } from './mock-maps';
import { Pothole } from './pothole';

describe('Item generator', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockMaps
            ]
        });
    });

    const itemGenerator = new 
    let mockMaps: MockMaps;

    beforeEach(inject([MockMaps], (mockMapFactory: MockMaps) => {
        mockMaps = mockMapFactory;
    }));

    it('should be created', () => {
        expect(mockMaps.functionalMap1()).toBeTruthy();
    });

    it('should add an item', () => {
        expect(mockMaps.functionalMap1()).addItem(Pothole, mockMaps.functionalMap1(), mockMaps.functionalMap1().potholes);
    });

});
