import { TestBed, inject } from '@angular/core/testing';

import { MapEditorService } from './map-editor.service';
import { Map } from './map';
import { SerializedMap } from './serialized-map';
import { MockMaps } from './mock-maps';
import { MockSerializedMaps } from './mock-serialized-maps';
import { AbstractRacingUnitConversionService } from './abstract-racing-unit-conversion.service';
import { RacingUnitConversionService } from './map-renderer/racing-unit-conversion.service';
import { Point } from './point';

describe('MapEditorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MapEditorService,
                AbstractRacingUnitConversionService,
                    {
                        provide: AbstractRacingUnitConversionService,
                        useClass: RacingUnitConversionService
                    },
                MockMaps,
                MockSerializedMaps
            ]
        });
    });

    let service: MapEditorService;
    let mockMaps: MockMaps;
    let mockSerializedMaps: MockSerializedMaps;

    beforeEach(inject([MapEditorService, MockMaps, MockSerializedMaps],
                      (injectedService: MapEditorService,
                       mockMapFactory: MockMaps,
                       mockSerializedMapFactory: MockSerializedMaps) => {
        service = injectedService;
        service.mapWidth = 500;
        service.mapHeight = 300;
        mockMaps = mockMapFactory;
        mockSerializedMaps = mockSerializedMapFactory;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service['map']).toBeTruthy();
    });

    it('should be able to replace a previous map', () => {
        const INITIAL_MAP = service['map'];
        expect(INITIAL_MAP).toBeTruthy();

        service.newMap();
        const NEW_MAP = service['map'];
        expect(NEW_MAP).toBeTruthy();
        expect(INITIAL_MAP).not.toBe(NEW_MAP);
    });

    const CHECK_SERIALIZATION = (map: Map, serializedMap: SerializedMap) => {
        expect(map.name).toEqual(serializedMap.name);
        expect(map.description).toEqual(serializedMap.description);

        expect(map.path.points.length).toEqual(serializedMap.points.length);
        expect(map.plays).toEqual(serializedMap.numberOfPlays);
        expect(map.potholes).toEqual(serializedMap.potholes);
        expect(map.puddles).toEqual(serializedMap.puddles);
        expect(map.speedBoosts).toEqual(serializedMap.speedBoosts);
        expect(map.type).toEqual(serializedMap.type);

        let expectedRating: number;
        if (serializedMap.numberOfRatings !== 0) {
            expectedRating =
                serializedMap.sumRatings / serializedMap.numberOfRatings;
        }
        else {
            expectedRating = 0;
        }
        expect(map.rating).toEqual(expectedRating);
    };

    describe('serializeMap', () => {

        it('should serialize maps if they are valid', () => {
            const FUNCTIONAL1 = mockMaps.functionalMap1();
            service['map'] = FUNCTIONAL1;
            CHECK_SERIALIZATION(FUNCTIONAL1, service.serializeMap());
            const FUNCTIONAL2 = mockMaps.functionalMap2();
            service['map'] = FUNCTIONAL2;
            CHECK_SERIALIZATION(FUNCTIONAL2, service.serializeMap());
        });

        it('should not serialize maps if they are not valid', () => {
            service['map'] = mockMaps.disfunctionalMap1();
            expect(() => service.serializeMap()).toThrow();
            service['map'] = mockMaps.disfunctionalMap2();
            expect(() => service.serializeMap()).toThrow();
            service['map'] = mockMaps.emptyMap1();
            expect(() => service.serializeMap()).toThrow();
        });

        it('should not serialize maps if either width or height is not set', () => {
            service.mapWidth = -1;
            service.mapHeight = -1;

            service['map'] = mockMaps.functionalMap1();
            expect(() => service.serializeMap()).toThrow();
            service['map'] = mockMaps.disfunctionalMap1();
            expect(() => service.serializeMap()).toThrow();

            const INITIAL_WIDTH = service.mapWidth;
            service.mapWidth = 500;
            service['map'] = mockMaps.functionalMap1();
            expect(() => service.serializeMap()).toThrow();

            service.mapWidth = INITIAL_WIDTH;
            service.mapHeight = 300;
            service['map'] = mockMaps.functionalMap1();
            expect(() => service.serializeMap()).toThrow();
        });

    });

    describe('deserializeMap', () => {

        it('should deserialize maps if they are valid', () => {
            service.mapWidth = 500;
            service.mapHeight = 300;

            const MAPS: SerializedMap[] = [
                mockSerializedMaps.functional1(),
                mockSerializedMaps.functional2()
            ];

            MAPS.forEach((map: SerializedMap) => {
                const FUNCTIONAL1 = mockSerializedMaps.functional1();
                service.deserializeMap(FUNCTIONAL1);
                CHECK_SERIALIZATION(service.currentMap, FUNCTIONAL1);
            });
        });

        it('should not deserialize maps if they are not valid', () => {
            const DISFUNCTIONAL_MAPS: SerializedMap[] = [
                mockSerializedMaps.disfunctional1(),
                mockSerializedMaps.disfunctional2()
            ];

            DISFUNCTIONAL_MAPS.forEach((map: SerializedMap) => {
                expect(() => service.deserializeMap(map)).toThrow();
            });
        });

        it('should not deserialize maps if either width or height is not set', () => {
            service.mapWidth = -1;
            service.mapHeight = -1;

            const FUNCTIONAL = mockSerializedMaps.functional1();
            expect(() => service.deserializeMap(FUNCTIONAL)).toThrow();
            const DISFUNCTIONAL = mockSerializedMaps.disfunctional1();
            expect(() => service.deserializeMap(DISFUNCTIONAL)).toThrow();
        });

    });


    it('should be able to check if a path loops back', () => {
        service['map'] = mockMaps.functionalMap1();
        expect(service['map'].isClosed()).toBe(true);
        service['map'] = mockMaps.emptyMap1();
        expect(service['map'].isClosed()).toBe(false);
    });

    it('should be able to add a valid point', () => {
        service['map'] = mockMaps.emptyMap1();
        service['map']['height'] = 500;
        service['map']['width'] = 500;

        expect(service['map'].path.points.length).toBe(0);
        const VALID_POINT: Point = new Point(3, 4);
        service.pushPoint(VALID_POINT);
        expect(service['map'].path.points.length).toBe(1);
        expect(service['map'].path.points).toContain(VALID_POINT);

        const INVALID_POINT: Point = new Point(1, 10000);
        service.pushPoint(INVALID_POINT);
        expect(service['map'].path.points.length).toBe(1);
        expect(service['map'].path.points).not.toContain(INVALID_POINT);
    });

    it('should be able to delete a point', () => {
        service['map'] = mockMaps.emptyMap1();
        const POINT: Point = new Point(3, 4);
        service['map'].path.points.push(POINT);

        expect(service['map'].path.points.length).toBe(1);
        service.popPoint();
        expect(service['map'].path.points.length).toBe(0);
    });

    it('should be able to edit a point', () => {
        service['map'] = mockMaps.functionalMap1();

        service.editPoint(0, new Point(3, 3));
        expect(service['map'].path.points[0].x).toBe(3);
        expect(service['map'].path.points[0].y).toBe(3);
        service.editPoint(0, new Point(-100, 10000));
        expect(service['map'].path.points[0].x).not.toBe(-100);
        expect(service['map'].path.points[0].y).not.toBe(10000);
    });

    it('should provide points', () => {
        service['map'] = mockMaps.functionalMap1();

        expect(service.path).toEqual(mockMaps.functionalMap1().path);
    });

});
