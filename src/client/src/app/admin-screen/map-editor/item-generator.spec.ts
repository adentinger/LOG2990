import { TestBed, inject } from '@angular/core/testing';
import { ItemGenerator } from './item-generator';
import { MockMaps } from './mock-maps';
import { Pothole } from './pothole';
import { SpeedBoost } from './speed-boost';
import { Point } from '../../../../../common/src/math/point';

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

        const map2 = mockMaps.functionalMap1();

        itemGenerator.generatePositions(map2, true);
        for (let i = 0; i < itemGenerator.positions.length; i++) {
            console.log(itemGenerator.positions[i]);
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

        itemGenerator.addObstacle(Pothole, map2, map2.potholes);
        expect(map2.potholes.length).toEqual(3);

        itemGenerator.generatePositions(map1);
        itemGenerator.addObstacle(SpeedBoost, map1, map1.speedBoosts);
        expect(map1.speedBoosts.length).toEqual(0);
    });

    it('should randomly modify the positions of objects in an array of some type', () => {
        const map = mockMaps.functionalMap1();
        const previousArray = map.potholes.slice();

        itemGenerator.randomlyModifyObjectsTypePositions(Pothole, map, map.potholes);
        expect(previousArray.length).toEqual(map.potholes.length);

        const duplicates = [];
        let duplicate = false;
        for (let i = 0 ; i < map.potholes.length; i++) {
            if (!duplicates.includes(map.potholes[i].position)) {
                duplicates.push(map.potholes[i].position);
            }
            else {
                duplicate = true;
            }
        }
        expect(duplicate).toBeFalsy();

    });

    it('should verfy is object position is on map', () => {
        const map = mockMaps.functionalMap1();

        const positionDoNotExist = 2;
        const positiontExistOnPotHoles = 11;
        const positiontExistOnPuddle = 15;
        const positiontExistOnSpeedBooster = 1;

        expect(itemGenerator.positionIsOnMap(map, positionDoNotExist)).toBeFalsy();
        expect(itemGenerator.positionIsOnMap(map, positiontExistOnPotHoles)).toBeTruthy();
        expect(itemGenerator.positionIsOnMap(map, positiontExistOnPuddle)).toBeTruthy();
        expect(itemGenerator.positionIsOnMap(map, positiontExistOnSpeedBooster)).toBeTruthy();
    });

    it('should calculate item coordinates', () => {
        const map = mockMaps.functionalMap1();
        const point = new Point(5.75736, 4.24264);
        expect(itemGenerator.itemCoordinates(map, map.speedBoosts[0])).toEqual(new Point(1, 0));
        expect(itemGenerator.itemCoordinates(map, map.speedBoosts[2]).x).toBeCloseTo(point.x);
        expect(itemGenerator.itemCoordinates(map, map.speedBoosts[2]).y).toBeCloseTo(point.y);
    });

});
