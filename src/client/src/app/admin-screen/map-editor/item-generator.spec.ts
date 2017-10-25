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

    it('should generate a unique position', () => {
        const map1 = mockMaps.functionalMap1();

        itemGenerator.generatePositions(map1);
        for (let i = 0; i < itemGenerator.positions.length; i++) {
            for (let j = i + 1; j < itemGenerator.positions.length; j++) {
                expect(itemGenerator.positions[i]).not.toEqual(itemGenerator.positions[j]);
            }
        }
    });

    it('should add an item', () => {
        const map1 = mockMaps.functionalMap1();
        const map2 = mockMaps.functionalMap2();

        itemGenerator.generatePositions(map2);

        itemGenerator.addObstacle(Pothole, map2, map2.potholes);
        expect(map2.potholes.length).toEqual(1);
        console.log(map2.potholes[0].position);
        console.log(itemGenerator.positions[0]);

        itemGenerator.addObstacle(Pothole, map2, map2.potholes);
        expect(map2.potholes.length).toEqual(3);
        console.log(map2.potholes[1].position, map2.potholes[2].position);
        console.log(itemGenerator.positions[1], itemGenerator.positions[2]);

        itemGenerator.generatePositions(map1);
        itemGenerator.addObstacle(SpeedBoost, map1, map1.speedBoosts);
        expect(map1.speedBoosts.length).toEqual(0);
    });

    it('should randomly modify the positions of objects in an array of some type', () => {
        const map = mockMaps.functionalMap1();
        const previousArray = map.potholes;
        for (let i = 0; i < previousArray.length; i++) {
            console.log(previousArray[i]);
        }

        itemGenerator.randomlyModifyObjectsTypePositions(Pothole, map, map.potholes);
        console.log(map.potholes.length);
        for (let i = 0; i < map.potholes.length; i++) {
            console.log(map.potholes[i]);
        }
        expect(previousArray.length).toEqual(map.potholes.length);
    });

});
